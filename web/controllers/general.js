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
    pageHeader: "Submit Data batuk",
    message: "",
  });
};

exports.inform_consent = async (req, res, next) => {
  res.render("general/inform-conset", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Inform Consent",
    message: "",
  });
};

exports.post_submit_data_batuk = async (req, res, next) => {
  if (Object.keys(req.body).length != 0) {
    var fileArray = [];
    for (let index = 0; index < req.files.length; index++) {
      var splitdotArray = req.files[index].originalname.split(".");
      fileArray[req.files[index].fieldname] = req.files[index].filename + "." + splitdotArray[splitdotArray.length - 1];
    }
    if (req.body.consent == "tidak") {
      res.render("general/submit-data-batuk", {
        success: false,
        message: "Anda Harus Menyetujui Inform Consent Yang Ada",
      });
    } else if (req.body.consent == "ya") {
      if (typeof fileArray['batuk_primer'] !== 'undefined') {
        try {
          for (let index = 0; index < req.files.length; index++) {
            handleUploadFile(req.files[index], "./public/uploads/" + req.files[index].fieldname + "/");
          }

          const batuk = await Batuk_Data.create({
            uuid: req.body.uniqueID,
            consent: req.body.consent,
            nama: req.body.nama,
            no_hp: req.body.no_hp,
            alamat: req.body.alamat,
            email: req.body.email,
            hasil_swab: req.body.hasil_swab,
            background_noise: req.body.back_noise,
            submit_method: req.body.method_upload,
            file_identitas: ((typeof fileArray['file_identitas'] !== 'undefined') ? fileArray['file_identitas'] : ''),
            file_swab: ((typeof fileArray['file_swab'] !== 'undefined') ? fileArray['file_swab'] : ''),
            file_audio: fileArray['batuk_primer'],
          });
          if (batuk) {
            res.render("general/submit-data-batuk", {
              success: true,
              message: "Berhasil Input Data, Halaman akan dimuat ulang otomatis.....",
            });
          } else {
            console.log(req.files);
            console.log({
              uuid: req.body.uniqueID,
              consent: req.body.consent,
              nama: req.body.nama,
              no_hp: req.body.no_hp,
              alamat: req.body.alamat,
              email: req.body.email,
              hasil_swab: req.body.hasil_swab,
              background_noise: req.body.back_noise,
              submit_method: req.body.method_upload,
              file_identitas: fileArray['file_identitas'],
              file_swab: fileArray['file_swab'],
              file_audio: fileArray['batuk_primer'],
            });
            res.render("general/submit-data-batuk", {
              success: false,
              message: "Error Input Data : Silahkan Hubungi Administrator",
            });
          }
        } catch (error) {
          res.render("general/submit-data-batuk", {
            success: false,
            message: "Error Input Data : " + error.toString(),
          });
        }
      } else {
        res.render("general/submit-data-batuk", {
          success: false,
          message: "Error Input Data : Silahkan Isi Form Dengan Lengkap",
        });
      }
    }
  } else {
    res.render("general/submit-data-batuk", {
      success: false,
      message: "Empty Data, Silahkan Isi Form Dengan Lengkap",
    });
  }
};
