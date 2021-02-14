const User = require("../models/user");

exports.clientAuth = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
};
exports.checkAuth = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.isAuth = (req, res, next) => {
  User.countDocuments({}).then((count) => {
    if (!req.session.isLoggedIn && count > 0) {
      return res.redirect("/login");
    }
    next();
  });
};
