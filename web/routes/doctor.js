const express = require("express");

const doctorController = require("../controllers/doctor");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get(
  "/doctor",
  auth.isAuth,
  checkingRole.isDoctor,
  doctorController.home
);

router.get(
  "/add-patient",
  auth.isAuth,
  checkingRole.isDoctor,
  doctorController.add_patient
);

router.post(
  "/create-patient",
  auth.isAuth,
  checkingRole.isDoctor,
  doctorController.create_patient
);

module.exports = router;
