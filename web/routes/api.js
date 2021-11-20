const express = require("express");

const apiController = require("../controllers/api");
const apiControllerDevice = require("../controllers/api/device/device");
const isAuthApi = require('../middlewares/is-aut-user-api');

const router = express.Router();

//Auth API
router.post('/api/login', apiController.login);


//Device API
router.post('/api/device/sendData/:device_id', apiControllerDevice.sendData);

module.exports = router;
