const express = require("express");
const iotController = require("../controllers/iotdata")
const router = express.Router();

router.get("/iotdata",iotController.data_dummy);

module.exports = router;