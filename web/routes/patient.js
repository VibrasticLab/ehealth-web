const express = require("express");

const patientController = require("../controllers/patient");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/patient", auth.isAuth, checkingRole.isPatient, patientController.home);

module.exports = router;