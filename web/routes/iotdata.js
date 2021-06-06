const express = require("express");
const router = express.Router();

router.get("/iotdata", function(req,res){res.send("Coba API")});

module.exports = router;