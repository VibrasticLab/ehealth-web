const express = require("express");

const generalController = require("../controllers/general");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/", generalController.home);
router.get("/edit-profile", generalController.edit_profile);
router.get("/account-setting", generalController.account_setting);

module.exports = router;