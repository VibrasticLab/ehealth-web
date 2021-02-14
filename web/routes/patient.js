const express = require("express");

const patientController = require("../controllers/patient");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/patient", patientController.home);

module.exports = router;