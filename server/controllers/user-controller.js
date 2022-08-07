const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Validation error! Please enter correct email.",
            errors.array()
          )
        );
      }
      const { email, password } = req.body;
      const userData = await userService.register(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userData = await userService.deleteUser(req.params.link);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async deleteManyUsers(req, res, next) {
    try {
      const users = req.body;
      //console.log(users)
      const userData = await userService.deleteManyUsers(users);
      return res.json({ message: "Users successfully deleted", userData });
    } catch (e) {
      next(e);
    }
  }

  async blockManyUsers(req, res, next) {
    try {
      const users = req.body;
      console.log(users);
      const userData = await userService.blockManyUsers(users);
      return res.json({ message: "Users successfully blocked", userData });
    } catch (e) {
      next(e);
    }
  }

  async unblockManyUsers(req, res, next) {
    try {
      const users = req.body;
      const userData = await userService.unblockManyUsers(users);
      return res.json({ message: "Users successfully unblocked", userData });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
