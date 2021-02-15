const express = require("express");

const adminController = require("../controllers/admin");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/admin", auth.isAuth, checkingRole.isAdmin, adminController.home);
router.get(
  "/add-doctor",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.add_doctor
);
router.post(
  "/create-doctor",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.create_doctor
);

module.exports = router;
