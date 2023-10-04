const json2csv = require("json2csv").parse;
const path = require("path");
const fs = require("fs");
const { readdirSync } = require("fs");
const child_process = require('child_process');

const User = require("../models/user");
const Device = require("../models/device");
const Device_Data_Cough = require("../models/device_data_cough");
const Device_Data_Audiometri = require("../models/device_data_audiometri");
const Device_Data_Naracoba = require("../models/device_data_cough_naracoba");
const Batuk_Data = require("../models/batuk_data");

const bcrypt = require("bcryptjs");

exports.home = async (req, res, next) => {
  const adminData = await User.findById(req.session.user._id, {
    doctorList: 1,
  });
  const totalPatient = await User.count({
    role: "patient",
    doctor: adminData.doctorList,
  });
  const doctorData = await User.find({
    role: "doctor",
    admin: req.session.user._id,
  });
  const deviceDataList = await Device.find({
    admin: req.session.user._id,
  });
  //console.log(req.session.user);
  res.render("admin/home-admin", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "E-Health Dashboard",
    role: req.session.user.role,
    userdata: req.session.user,
    totalPatient: totalPatient,
    totalDoctor: doctorData.length,
    totalDevice: deviceDataList.length,
    doctor: doctorData,
  });
};

exports.doctor_list = async (req, res, next) => {
  const adminData = await User.findById(req.session.user._id, {
    doctorList: 1,
  });
  const totalPatient = await User.count({
    role: "patient",
    doctor: adminData.doctorList,
  });
  const doctorData = await User.find({
    role: "doctor",
    admin: req.session.user._id,
  });
  res.render("admin/doctor-list", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Doctor List",
    role: req.session.user.role,
    userdata: req.session.user,
    totalPatient: totalPatient,
    totalDoctor: doctorData.length,
    doctor: doctorData,
  });
};

exports.device_list = async (req, res, next) => {
  const deviceDataList = await Device.find({
    admin: req.session.user._id,
  });
  res.render("admin/device-list", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Device List",
    userdata: req.session.user,
    deviceList: deviceDataList,
    role: req.session.user.role,
  });
};

exports.device_detail = async (req, res, next) => {
  var device_id = req.query.device_id;
  var deviceData_Datas = {};
  const deviceData = await Device.find({
    admin: req.session.user._id,
    device_id: device_id,
  });
  if (deviceData[0].type == 'audiometri') {
    deviceData_Datas = await Device_Data_Audiometri.find({
      device_id: device_id,
    }).sort({ time: "desc" });
  } else if (deviceData[0].type == 'cough') {
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
  var query = (req.query.search != undefined && req.query.search) ? {email: req.query.search} : {};
  var searchVal = (req.query.search != undefined && req.query.search) ? req.query.search : "";

  const batukData_count = await Batuk_Data.countDocuments(query)
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
  var folderpath = './public/uploads/batuk_primer'

  child_process.execSync(`zip -r archive *`, {
    cwd: folderpath
  });

  res.download(folderpath + '/archive.zip');
};

exports.data_batuk_naracoba = async (req, res, next) => { 
  const resultsPerPage = 25;
  let page = req.query.page >= 1 ? req.query.page : 1;
  var query = (req.query.search != undefined && req.query.search) ? {device_id: req.query.search} : {};
  var searchVal = (req.query.search != undefined && req.query.search) ? req.query.search : "";

  const batukData_count = await Device_Data_Naracoba.countDocuments(query)
  const batukData = await Device_Data_Naracoba.find(query)
    .sort({ time: "desc" })
    .limit(resultsPerPage)
    .skip(resultsPerPage * (page - 1));

  res.render("admin/data-batuk_naracoba", {
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

exports.data_batuk_naracoba_edit = async (req, res, next) => { 
  const batukData = await Device_Data_Naracoba.find({uuid: req.query.uuid});

  res.render("admin/data-batuk_naracoba_edit", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Edit Data Naracoba",
    batukData: batukData,
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.data_batuk_naracoba_edit_post = async (req, res, next) => { 
  var nowbatukData = await Device_Data_Naracoba.find({uuid: req.body.uuid });
  var data_json = JSON.parse(nowbatukData[0].json_data);
  data_json['nama'] = req.body.full_name;
  data_json['gender'] = req.body.gender;
  data_json['umur'] = req.body.umur;
  
  const user = await Device_Data_Naracoba.update(
    { uuid: req.body.uuid },
    {
      json_data: JSON.stringify(data_json)
    },
  );

  res.redirect("/admin/data-batuk-naracoba");
};

exports.data_batuk_device_edit = async (req, res, next) => { 
  const batukData = await Device_Data_Cough.find({uuid: req.query.uuid});

  res.render("admin/data-batuk_device_edit", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Edit Data Batuk",
    batukData: batukData,
    userdata: req.session.user,
    role: req.session.user.role,
  });
};

exports.data_batuk_device_edit_post = async (req, res, next) => { 
  var nowbatukData = await Device_Data_Cough.find({uuid: req.body.uuid });
  var data_json = JSON.parse(nowbatukData[0].json_data);
  data_json['nama'] = req.body.full_name;
  data_json['gender'] = req.body.gender;
  data_json['umur'] = req.body.umur;
  
  const user = await Device_Data_Cough.update(
    { uuid: req.body.uuid },
    {
      json_data: JSON.stringify(data_json)
    },
  );

  res.redirect("/admin/data-batuk-naracoba");
};

exports.data_batuk_naracoba_export = async (req, res, next) => {
  const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, "").slice(0, 14);
  let csv;
  const filePath = path.join(__dirname, "../", "temp", "csv-" + dateTime + ".csv");
  const batukArray = await Device_Data_Naracoba.find();
  const fields = ["time", "uuid", "device_id", "json_data",  "filename"];
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
