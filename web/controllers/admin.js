const User = require("../models/user");
const Device = require("../models/device");
const Device_Data = require("../models/device_data");

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
  console.log(req.session.user);
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
  const deviceData = await Device.find({
    admin: req.session.user._id,
    device_id: device_id,
  });
  const deviceData_Datas = await Device_Data.find({
    device_id: device_id,
  });
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
  console.log(req.body.device_id)
  try {
    const device = await Device.deleteOne(
      { device_id: req.body.device_id}, //Required
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
