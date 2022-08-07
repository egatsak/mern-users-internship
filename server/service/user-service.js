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
      throw ApiError.BadRequest(`User with email ${email} already exists!`);
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
      `${process.env.API_URL}/active/${activationLink}`
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
    if (user.isBlocked) {
      throw ApiError.BlockedError();
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
    const users = await User.find();
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
    for (let { _id, email } of users) {
      console.log(_id, "id");
      const user = await User.findByIdAndDelete(_id);
      if (!user) {
        console.log(`User ${email} wasn't found!`);
        continue;
      }
      const userDto = new UserDto(user);
      usersDeleted.push(userDto);
      await tokenService.removeTokenByUserId(_id);
    }
    return usersDeleted;
  }

  async blockManyUsers(users) {
    console.log(users);
    const usersBlocked = [];
    for (let { _id, email } of users) {
      const user = await User.findById(_id);
      if (!user) {
        console.log(`User ${email} wasn't found!`);
        continue;
      }
      user.isBlocked = true;
      await user.save();
      const userDto = new UserDto(user);
      usersBlocked.push(userDto);
      await tokenService.removeTokenByUserId(_id);
    }
    const usersDb = await User.find();
    return usersDb;
  }

  async unblockManyUsers(users) {
    console.log(users);
    const usersUnblocked = [];
    for (let { _id, email } of users) {
      const user = await User.findById(_id);
      if (!user) {
        console.log(`User ${email} wasn't found!`);
        continue;
      }
      user.isBlocked = false;
      await user.save();
      const userDto = new UserDto(user);
      usersUnblocked.push(userDto);
    }
    return usersUnblocked;
  }
}

module.exports = new UserService();
