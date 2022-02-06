const express = require("express");
const multer  = require('multer')
const upload = multer({ dest: './temp/' })

const generalController = require("../controllers/general");

const router = express.Router();

router.post('/submit-data-batuk', upload.any() , generalController.post_submit_data_batuk);

module.exports = router;

