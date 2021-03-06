const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/user");

const authController = require("../controllers/auth");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/signin", authController.getLogin);
router.get("/logout", authController.getLogout);
router.get("/signup", auth.isUserEmpty, authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.").isLength({ min: 5 }).trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  auth.isUserEmpty,
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body("username", "username empty")
      .isLength({ min: 2 })
      .custom((value, { req }) => {
        return User.findOne({ userName: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Username exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          // throw new Error('Passwords have to match!');
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
