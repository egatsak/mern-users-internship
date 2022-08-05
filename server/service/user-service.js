const User = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const { randomUUID } = require("node:crypto");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const tokenModel = require("../models/token-model.js");

class UserService {
  async register(email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    const activationLink = randomUUID();

    const user = await User.create({
      email,
      password: hashedPassword,
      activationLink,
    });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/active/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link!");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User ${email} wasn't found!`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Incorrect password!`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = User.find();
    return users;
  }

  async deleteUser(activationLink) {
    const user = await User.findOneAndDelete({ activationLink });
    if (!user) {
      throw ApiError.BadRequest(`User wasn't found!`);
    }
    const refreshToken = await tokenService.findTokenByUserId(user.id);
    const token = await tokenService.removeToken(refreshToken.refreshToken);
    if (!token) {
      console.log("TOKEN NOT FOUND!!!!!");
    }
    return { user, token };
  }

  async deleteManyUsers(users) {
    const usersDeleted = [];
    for (let { id, email } of users) {
      console.log(id, "id");
      const user = await User.findByIdAndDelete(id);
      console.log({ user }, "user");

      if (!user) {
        console.log(`User ${email} wasn't found!`);
        continue;
      }

      usersDeleted.push(user.email);
      const refrToken = await tokenService.removeTokenByUserId(
        id
      );
      console.log(refrToken, "refrToken");
    }
    return { usersDeleted };
  }

  async blockUser(activationLink) {}
}

module.exports = new UserService();
