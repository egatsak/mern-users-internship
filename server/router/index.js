const Router = require("express");
const userController = require("../controllers/user-controller.js");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth-middleware");

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 1, max: 32 }),
  userController.register
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/delete/:link", authMiddleware, userController.deleteUser);
router.post("/deleteMany", authMiddleware, userController.deleteManyUsers);
router.get("/active/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

module.exports = router;
