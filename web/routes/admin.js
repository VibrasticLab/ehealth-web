const express = require("express");

const adminController = require("../controllers/admin");
const auth = require("../middlewares/auth");
const checkingRole = require("../middlewares/check-role");

const router = express.Router();

router.get("/admin", auth.isAuth, checkingRole.isAdmin, adminController.home);

router.get(
  "/admin/device-list",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.device_list
);

router.get(
  "/admin/add-device",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.add_device
);

router.get(
  "/admin/device-detail",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.device_detail
);

router.post(
  "/admin/create-device",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.create_device
);

router.post(
  "/admin/delete-device",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.delete_device
);

router.get(
  "/admin/data-batuk",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.data_batuk
);

router.get(
  "/admin/data-batuk-export",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.data_batuk_export
);

router.get(
  "/admin/data-batuk-export-sound",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.data_batuk_export_sound
);

router.get(
  "/admin/data-batuk-naracoba",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.data_batuk_naracoba
);

router.get(
  "/admin/data-batuk-naracoba-edit",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.data_batuk_naracoba_edit
);

router.get(
  "/admin/data-batuk-naracoba-edit",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.data_batuk_naracoba_edit
);

router.post(
  "/admin/data-batuk-naracoba-post",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.data_batuk_naracoba_edit_post
);

router.get(
  "/admin/doctor-list",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.doctor_list
);

router.get(
  "/admin/add-doctor",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.add_doctor
);

router.post(
  "/admin/create-doctor",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.create_doctor
);

router.get(
  "/admin/coba",
  auth.isAuth,
  checkingRole.isAdmin,
  adminController.coba
);

module.exports = router;
