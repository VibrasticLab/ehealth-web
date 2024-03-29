const express = require("express");
const errorController = require("../controllers/error");

const router = express.Router();

router.get("/500", errorController.get500);
router.get("/error-catch", errorController.getError_catch);
router.use(errorController.get404);
router.use(errorController.get500);



module.exports = router;
