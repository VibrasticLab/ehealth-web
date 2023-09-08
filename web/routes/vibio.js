const express = require("express");

const vibioController = require("../controllers/vibio");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/admin/vibio/user-list", auth.isAuth, checkingRole.isAdmin, vibioController.user_list);
router.get("/admin/vibio/user-add", auth.isAuth, checkingRole.isAdmin, vibioController.user_add);
router.post("/admin/vibio/create-user", auth.isAuth, checkingRole.isAdmin, vibioController.create_user);
router.post("/admin/vibio/delete-user", auth.isAuth, checkingRole.isAdmin, vibioController.delete_user);

router.get("/admin/vibio/terapi-list/:user_uuid", auth.isAuth, checkingRole.isAdmin, vibioController.terapi_list);
router.get("/admin/vibio/terapi-detail/:jenis_terapi/:user_uuid", auth.isAuth, checkingRole.isAdmin, vibioController.terapi_detail);

router.get("/vibio_hidden/terapi-list/:secret_user_uuid", vibioController.terapi_list_secret);
router.get("/vibio_hidden/terapi-detail/:jenis_terapi/:secret_user_uuid", vibioController.terapi_detail_secret);
// router.post("/admin/vibio/insert-terapi/:user_uuid", auth.isAuth, checkingRole.isAdmin, adminController.create_device);

module.exports = router;
