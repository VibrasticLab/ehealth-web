const express = require("express");
const multer  = require('multer')
const upload = multer({ dest: './temp/' })

const generalController = require("../controllers/general");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();
router.get("/", auth.redirectIndex);
router.get("/submit-data-batuk", generalController.submit_data_batuk);
router.get("/edit-profile", auth.isAuth, generalController.edit_profile);
router.get("/account-setting", auth.isAuth, generalController.account_setting);

module.exports = router;
