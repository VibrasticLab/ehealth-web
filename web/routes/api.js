const express = require("express");

const apiController = require("../controllers/api");
const isAuthApi = require('../middlewares/is-aut-user-api');

const router = express.Router();
router.post('/api/login', apiController.login);
module.exports = router;
