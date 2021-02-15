const User = require("../models/user");

exports.isAdmin = async (req, res, next) => {
  const role = await User.findById(req.session.user._id, { role: 1, _id: 0 });
  if (role !== null && role !== undefined && role.role === "admin") {
    next();
  } else {
    res.status(403).render("error/403", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
      role : req.session.user.role
    });
  }
};

exports.isDoctor = async (req, res, next) => {
  const role = await User.findById(req.session.user._id, { role: 1, _id: 0 });
  if (role !== null && role !== undefined && role.role === "doctor") {
    next();
  } else {
    res.status(403).render("error/403", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
      role : req.session.user.role
    });
  }
};

exports.isPatient = async (req, res, next) => {
  const role = await User.findById(req.session.user._id, { role: 1, _id: 0 });
  if (
    role !== null &&
    role !== undefined &&
    role.role === "patient"
  ) {
    next();
  } else {
    res.status(403).render("error/403", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
      role : req.session.user.role
    });
  }
};
