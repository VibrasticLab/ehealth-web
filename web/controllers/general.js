const { handleUploadFile } = require("../helpers/helper_functions");
const Batuk_Data = require("../models/batuk_data");

exports.home = async (req, res, next) => {
  res.render("general/home", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Home",
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.edit_profile = async (req, res, next) => {
  res.render("general/edit-profile", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Edit Profile",
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.account_setting = async (req, res, next) => {
  res.render("general/account-setting", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Account Setting",
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.submit_data_batuk = async (req, res, next) => {
  res.render("general/submit-data-batuk", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Account Setting",
    message: "",
  });
};

exports.post_submit_data_batuk = async (req, res, next) => {
  if (Object.keys(req.body).length != 0) {
    let tempJsonData = req.body;
    if (req.files.length != 0) {
      var splitdotArray = req.files[0].originalname.split(".");
      tempJsonData.file_audio = req.files[0].filename + "." + splitdotArray[splitdotArray.length - 1];
      handleUploadFile(req.files[0], "./public/uploads/batuk_primer/");
    }
    const batuk = await Batuk_Data.create({
      uuid: req.body.uniqueID,
      email: req.body.email,
      background_noise: req.body.back_noise,
      submit_method: req.body.method_upload,
      filename: tempJsonData.file_audio,
    });
    if (batuk) {
      res.render("general/submit-data-batuk", {
        success: true,
        message: "Berhasil Input Data",
      });
    } else {
      res.render("general/submit-data-batuk", {
        success: false,
        message: "Error Input Data",
      });
    }
  } else {
    res.render("general/submit-data-batuk", {
      success: false,
      message: "Empty Data",
    });
  }
};
