const json2csv = require("json2csv").parse;
const path = require("path");
const fs = require("fs");
const { readdirSync } = require("fs");
const child_process = require("child_process");

const User = require("../models/user");
const Device = require("../models/device");
const Vibio_terapi = require("../models/vibio_terapi");
const Vibio_user = require("../models/vibio_user");

const bcrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");

exports.user_list = async (req, res, next) => {
  const resultsPerPage = 25;
  let page = req.query.page >= 1 ? req.query.page : 1;
  var query = req.query.search != undefined && req.query.search ? { uuid: req.query.search, admin: req.session.user._id } : { admin: req.session.user._id };
  var searchVal = req.query.search != undefined && req.query.search ? req.query.search : "";

  const userData_count = await Vibio_user.countDocuments(query);
  const userkData = await Vibio_user.find(query)
    .sort({ time: "desc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * (page - 1));

  res.render("admin/vibio/vibio-users", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Patient List",
    userdata: req.session.user,
    role: req.session.user.role,
    user_list: userkData,
    currentPage: page,
    pages: Math.ceil(userData_count / resultsPerPage),
    searchVal: searchVal,
    lastIndex: resultsPerPage * (page - 1),
    totalCount: userData_count,
  });
};

exports.user_add = async (req, res, next) => {
  res.render("admin/vibio/vibio-users_add", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Add Patient Vibio",
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.create_user = async (req, res, next) => {
  try {
    const user = await Vibio_user.updateOne(
      { uuid: req.body.no_hp, fullname: req.body.full_name, tanggal_lahir: req.body.birthday, admin: req.session.user._id }, //Required
      { uuid: req.body.no_hp, fullname: req.body.full_name, tanggal_lahir: req.body.birthday, admin: req.session.user._id },
      { upsert: true }
    );
    res.redirect("/admin/vibio/user-list");
  } catch (error) {
    console.log(error);
    res.render("error/error-catch", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
      role: req.session.user ? req.session.user.role : "",
      errorMessage: error.message,
    });
  }
};

exports.delete_user = async (req, res, next) => {
  try {
    const device = await Vibio_user.deleteOne(
      { uuid: req.body.uuid_user } //Required
    );
    res.redirect("/admin/vibio/user-list");
  } catch (error) {
    console.log(error.message);
    res.render("error/error-catch", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
      role: req.session.user ? req.session.user.role : "",
      errorMessage: error.message,
    });
  }
};

exports.terapi_list = async (req, res, next) => {
  var dengarkanTerapi_count = await Vibio_terapi.countDocuments({ uuid_user: req.params.user_uuid, terapi: 0 });
  var dengarkanMengeja_count = await Vibio_terapi.countDocuments({ uuid_user: req.params.user_uuid, terapi: 1 });
  var dengarkanTebak_count = await Vibio_terapi.countDocuments({ uuid_user: req.params.user_uuid, terapi: 2 });

  var countData = {
    dengarkanTerapi_count: dengarkanTerapi_count,
    dengarkanMengeja_count: dengarkanMengeja_count,
    dengarkanTebak_count: dengarkanTebak_count,
  };

  res.render("admin/vibio/vibio-terapi", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "List Terapi",
    user_uuid: req.params.user_uuid,
    countData: countData,
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.terapi_detail = async (req, res, next) => {
  const resultsPerPage = 25;
  let page = req.query.page >= 1 ? req.query.page : 1;
  var query =
    req.query.search != undefined && req.query.search
      ? { uuid_user: req.params.user_uuid, terapi: req.params.jenis_terapi }
      : { uuid_user: req.params.user_uuid, terapi: req.params.jenis_terapi };
  var searchVal = req.query.search != undefined && req.query.search ? req.query.search : "";

  const terapiData_count = await Vibio_user.countDocuments(query);
  const terapiData = await Vibio_terapi.find(query)
    .sort({ time: "desc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * (page - 1));

  const FullterapiData = await Vibio_terapi.find({ uuid_user: req.params.user_uuid, terapi: req.params.jenis_terapi }).sort({ time: "desc" });

  res.render("admin/vibio/vibio-terapis_detail", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "List Terapi",
    user_uuid: req.params.user_uuid,
    jenis_terapi: req.params.jenis_terapi,
    terapiData: terapiData,
    userdata: req.session.user,
    role: req.session.user.role,
    currentPage: page,
    pages: Math.ceil(terapiData_count / resultsPerPage),
    searchVal: searchVal,
    lastIndex: resultsPerPage * (page - 1),
    totalCount: terapiData_count,
    FullterapiData: JSON.stringify(FullterapiData),
  });
};

// ----------------------------------------------- Secret Vibio

const vibio_scretk_key = process.env.VIBIO_SECRET;

exports.terapi_list_secret = async (req, res, next) => {
  // U2FsdGVkX1+HkYs5FVDGqKp3OhnEtejAAjICYZ70Vr4=

  var bytes = CryptoJS.AES.decrypt(decodeURI(req.params.secret_user_uuid), vibio_scretk_key);
  var decoded_user_uuid = bytes.toString(CryptoJS.enc.Utf8);
  const userData_count = await Vibio_user.countDocuments({ uuid: decoded_user_uuid });

  if (userData_count == 0) {
    res.status(401).render("error/401", {
      pageTitle: "Error!",
    });
    return;
  }

  var dengarkanTerapi_count = await Vibio_terapi.countDocuments({ uuid_user: decoded_user_uuid, terapi: 0 });
  var dengarkanMengeja_count = await Vibio_terapi.countDocuments({ uuid_user: decoded_user_uuid, terapi: 1 });
  var dengarkanTebak_count = await Vibio_terapi.countDocuments({ uuid_user: decoded_user_uuid, terapi: 2 });

  var countData = {
    dengarkanTerapi_count: dengarkanTerapi_count,
    dengarkanMengeja_count: dengarkanMengeja_count,
    dengarkanTebak_count: dengarkanTebak_count,
  };

  res.render("admin/vibio/apps_hidden/vibio-terapi", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "List Terapi",
    user_uuid: req.params.secret_user_uuid,
    countData: countData,
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.terapi_detail_secret = async (req, res, next) => {
  var bytes = CryptoJS.AES.decrypt(decodeURI(req.params.secret_user_uuid), vibio_scretk_key);
  var decoded_user_uuid = bytes.toString(CryptoJS.enc.Utf8);

  const resultsPerPage = 25;
  let page = req.query.page >= 1 ? req.query.page : 1;
  var query =
    req.query.search != undefined && req.query.search
      ? { uuid_user: decoded_user_uuid, terapi: req.params.jenis_terapi }
      : { uuid_user: decoded_user_uuid, terapi: req.params.jenis_terapi };
  var searchVal = req.query.search != undefined && req.query.search ? req.query.search : "";

  const terapiData_count = await Vibio_user.countDocuments(query);
  const terapiData = await Vibio_terapi.find(query)
    .sort({ time: "desc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * (page - 1));

  const FullterapiData = await Vibio_terapi.find({ uuid_user: decoded_user_uuid, terapi: req.params.jenis_terapi }).sort({ time: "desc" });

  res.render("admin/vibio/apps_hidden/vibio-terapis_detail", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "List Terapi",
    user_uuid: decoded_user_uuid,
    jenis_terapi: req.params.jenis_terapi,
    terapiData: terapiData,
    userdata: req.session.user,
    role: req.session.user.role,
    currentPage: page,
    pages: Math.ceil(terapiData_count / resultsPerPage),
    searchVal: searchVal,
    lastIndex: resultsPerPage * (page - 1),
    totalCount: terapiData_count,
    FullterapiData: JSON.stringify(FullterapiData),
  });
};

// ----------------------------------------------- Example

exports.device_detail = async (req, res, next) => {
  var device_id = req.query.device_id;
  var deviceData_Datas = {};
  const deviceData = await Device.find({
    admin: req.session.user._id,
    device_id: device_id,
  });
  if (deviceData[0].type == "audiometri") {
    deviceData_Datas = await Device_Data_Audiometri.find({
      device_id: device_id,
    }).sort({ time: "desc" });
  } else if (deviceData[0].type == "cough") {
    deviceData_Datas = await Device_Data_Cough.find({
      device_id: device_id,
    }).sort({ time: "desc" });
  }
  res.render("admin/device-detail", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Device Detail: " + device_id,
    userdata: req.session.user,
    device: deviceData,
    device_data: deviceData_Datas,
    role: req.session.user.role,
  });
};

exports.add_doctor = async (req, res, next) => {
  res.render("admin/add-doctor", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Add Doctor",
    role: req.session.user.role,
    userdata: req.session.user,
  });
};

exports.add_device = async (req, res, next) => {
  res.render("admin/add-device", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Add Device",
    role: req.session.user.role,
    userdata: req.session.user,
  });
};

exports.data_batuk = async (req, res, next) => {
  const resultsPerPage = 25;
  let page = req.query.page >= 1 ? req.query.page : 1;
  var query = req.query.search != undefined && req.query.search ? { email: req.query.search } : {};
  var searchVal = req.query.search != undefined && req.query.search ? req.query.search : "";

  const batukData_count = await Batuk_Data.countDocuments(query);
  const batukData = await Batuk_Data.find(query)
    .sort({ time: "desc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * (page - 1));

  // var hola = readdirSync("./public", { withFileTypes: true })
  //   .filter((dirent) => dirent.isDirectory())
  //   .map((dirent) => dirent.name);

  res.render("admin/data-batuk", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Data Batuk",
    userdata: req.session.user,
    batukData: batukData,
    currentPage: page,
    pages: Math.ceil(batukData_count / resultsPerPage),
    searchVal: searchVal,
    lastIndex: resultsPerPage * (page - 1),
    totalCount: batukData_count,
    role: req.session.user.role,
  });
};

exports.data_batuk_export = async (req, res, next) => {
  const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, "").slice(0, 14);
  let csv;
  const filePath = path.join(__dirname, "../", "temp", "csv-" + dateTime + ".csv");
  const batukArray = await Batuk_Data.find();
  const fields = ["id", "uuid", "email", "background_noise", "submit_method", "filename", "time"];
  try {
    csv = json2csv(batukArray, { fields });
  } catch (err) {
    console.log(err);
  }

  fs.writeFile(filePath, csv, function (err) {
    if (err) {
      console.log(err);
    } else {
      setTimeout(function () {
        fs.unlink(filePath, function (err) {
          if (err) {
            console.error(err);
          }
          console.log("File has been Deleted");
        });
      }, 30000);
      res.download(filePath);
    }
  });
};

exports.data_batuk_export_sound = async (req, res, next) => {
  var folderpath = "./public/uploads/batuk_primer";

  child_process.execSync(`zip -r archive *`, {
    cwd: folderpath,
  });

  res.download(folderpath + "/archive.zip");
};

exports.create_doctor = async (req, res, next) => {
  if (req.body.pass === req.body.rpass) {
    const hashedPw = await bcrypt.hash(req.body.pass, 12);
    const user = await User.update(
      { email: req.body.email, userName: req.body.uname },
      {
        email: req.body.email,
        userName: req.body.uname,
        fullName: { first: req.body.fname, last: req.body.lname },
        city: req.body.city,
        department: req.body.cname,
        doctorRole: req.body.selectuserrole,
        mobileNumber1: req.body.mobno,
        mobileNumber2: req.body.altconno,
        address1: req.body.add1,
        address2: req.body.add2,
        country: req.body.selectcountry,
        pinCode: req.body.pno,
        password: hashedPw,
        role: "doctor",
        admin: req.session.user._id,
      },
      { upsert: true }
    );
    if (user.upserted.length > 0) {
      User.updateOne({ _id: req.session.user._id }, { $push: { doctorList: user.upserted[0]._id } }).then((result) => {});
    }
  }
  res.redirect("/add-doctor");
};

exports.create_device = async (req, res, next) => {
  try {
    switch (req.body.selectDeviceType) {
      case "cough":
        if (req.body.passwordCred === req.body.rpasswordCred) {
          const hashedPw = await bcrypt.hash(req.body.passwordCred, 12);
          const device = await Device.updateOne(
            { device_id: req.body.deviceid, device_name: req.body.devicename, status: req.body.selectDeviceStatus, type: req.body.selectDeviceType }, //Required
            {
              device_id: req.body.deviceid,
              device_name: req.body.devicename,
              description: req.body.devicedesc,
              location: req.body.devicelocation,
              status: req.body.selectDeviceStatus,
              type: req.body.selectDeviceType,
              credential: { url: req.body.urlCred, username: req.body.usernameCred, password: hashedPw },
              admin: req.session.user._id,
            },
            { upsert: true }
          );
        }
        break;
      case "audiometri":
        const device = await Device.updateOne(
          { device_id: req.body.deviceid, device_name: req.body.devicename, status: req.body.selectDeviceStatus, type: req.body.selectDeviceType }, //Required
          {
            device_id: req.body.deviceid,
            device_name: req.body.devicename,
            description: req.body.devicedesc,
            location: req.body.devicelocation,
            status: req.body.selectDeviceStatus,
            type: req.body.selectDeviceType,
            credential: {},
            admin: req.session.user._id,
          },
          { upsert: true }
        );
        break;
      default:
        break;
    }
    res.redirect("/admin/device-list");
  } catch (error) {
    console.log(error.message);
    res.render("error/error-catch", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
      role: req.session.user ? req.session.user.role : "",
      errorMessage: error.message,
    });
  }
};

exports.delete_device = async (req, res, next) => {
  console.log(req.body.device_id);
  try {
    const device = await Device.deleteOne(
      { device_id: req.body.device_id } //Required
    );
    const deviceDataList = await Device.find({
      admin: req.session.user._id,
    });
    res.redirect("/admin/device-list");
  } catch (error) {
    console.log(error.message);
    res.render("error/error-catch", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
      role: req.session.user ? req.session.user.role : "",
      errorMessage: error.message,
    });
  }
};

exports.coba = async (req, res, next) => {
  res.render("admin/coba", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Coba Page",
    userdata: req.session.user,
    role: req.session.user.role,
  });
};
