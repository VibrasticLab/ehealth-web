const User = require("../models/user");

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
  res.render("admin/home-admin", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "E-Health Dashboard",
    role: req.session.user.role,
    totalPatient: totalPatient,
    totalDoctor : doctorData.length,
    doctor : doctorData,
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
    totalPatient: totalPatient,
    totalDoctor : doctorData.length,
    doctor : doctorData,
  });
};

exports.device_list = async (req, res, next) => {
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
  res.render("admin/device-list", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Device List",
    role: req.session.user.role,
    totalPatient: totalPatient,
    totalDoctor : doctorData.length,
    doctor : doctorData,
  });
};

exports.device_detail = async (req, res, next) => {
  console.log(req.query.device_id);
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
  res.render("admin/device-detail", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Device List",
    role: req.session.user.role,
    totalPatient: totalPatient,
    totalDoctor : doctorData.length,
    doctor : doctorData,
  });
};

exports.add_doctor = async (req, res, next) => {
  res.render("admin/add-doctor", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Add Doctor",
    role: req.session.user.role,
  });
};

exports.add_device = async (req, res, next) => {
  res.render("admin/add-device", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Add Device",
    role: req.session.user.role,
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
      User.updateOne(
        { _id: req.session.user._id },
        { $push: { doctorList: user.upserted[0]._id } }
      ).then((result) => {});
    }
  }
  res.redirect("/add-doctor");
};
