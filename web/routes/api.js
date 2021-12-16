const express = require("express");
const multer  = require('multer')
const upload = multer({ dest: './temp/' })

const apiController = require("../controllers/api");
const apiControllerDevice = require("../controllers/api/device/device");
const isAuthApi = require('../middlewares/is-aut-user-api');

const router = express.Router();

//Auth API
router.post('/api/login', apiController.login);


//Device API
router.post('/api/device/sendData/:device_id', upload.any() , apiControllerDevice.sendData);
router.post('/api/device/uploadData/:device_id', upload.any() ,apiControllerDevice.tryUpload);

module.exports = router;
