const User = require("../models/user");

exports.isAdmin = async (req, res, next) => {
  const role = await User.findById(req.session.user._id, { role: 1, _id: 0 });
  if (role.role !== null && role.role !== undefined && role.role === "admin") {
    next();
  } else {
    res.status(403).render("error/403", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
    });
  }
};

exports.isUser = async (req, res, next) => {
  const role = await User.findById(req.session.user._id, { role: 1, _id: 0 });
  if (
    role.role !== null &&
    role.role !== undefined &&
    (role.role === "user" || role.role === "admin")
  ) {
    next();
  } else {
    res.status(403).render("error/403", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
    });
  }
};

exports.isPublic = async (req, res, next) => {
  const role = await User.findById(req.session.user._id, { role: 1, _id: 0 });
  if (
    role.role !== null &&
    role.role !== undefined &&
    (role.role === "user" || role.role === "admin" || role.role === "public")
  ) {
    next();
  } else {
    res.status(403).render("error/403", {
      pageTitle: "Error!",
      isAuthenticated: req.session.isLoggedIn,
    });
  }
};
