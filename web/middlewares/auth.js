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
  if (!req.session.isLoggedIn) {
    return res.redirect("/signin");
  }
  next();
};

exports.redirectIndex = (req, res, next) => {
    if (!req.session.isLoggedIn) {
    return res.redirect("/submit-data-batuk");
  } else {
    if (req.session.user.role == "admin") {
      return res.redirect("/admin");
    } else if (req.session.user.role == "doctor") {
      return res.redirect("/doctor");
    }else if (req.session.user.role == "patient") {
      return res.redirect("/patient");
    }
  }
  
  // if (!req.session.isLoggedIn) {
  //   return res.redirect("/signin");
  // } else {
  //   if (req.session.user.role == "admin") {
  //     return res.redirect("/admin");
  //   } else if (req.session.user.role == "doctor") {
  //     return res.redirect("/doctor");
  //   }else if (req.session.user.role == "patient") {
  //     return res.redirect("/patient");
  //   }
  // }
};

exports.isUserEmpty = (req, res, next) => {
  User.countDocuments({}).then((count) => {
    if (count > 0) {
      //TODO: Remove Comment
      return res.redirect("/signin");
    }
    next();
  });
};
