const express = require("express");

const adminController = require("../controllers/admin");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/admin", adminController.home);
router.get("/add-doctor", adminController.add_doctor);

module.exports = router;
