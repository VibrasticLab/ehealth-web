const express = require("express");

const doctorController = require("../controllers/doctor");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/doctor", doctorController.home);
router.get("/add-patient", doctorController.add_patient);

module.exports = router;