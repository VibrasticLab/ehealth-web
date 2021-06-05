const express = require("express");

const generalController = require("../controllers/general");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();
router.get("/", auth.redirectIndex);
router.get("/edit-profile", auth.isAuth, generalController.edit_profile);
router.get("/account-setting", auth.isAuth, generalController.account_setting);

router.get('/coba', (req, res) => {
    res.json({"message": "coba-coba matamu ah"});
});

module.exports = router;
