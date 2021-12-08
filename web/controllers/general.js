exports.home = async (req, res, next) => {
  res.render("general/home", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Home",
    userdata: req.session.user,
    role : req.session.user.role
  });
};

exports.edit_profile = async (req, res, next) => {
  res.render("general/edit-profile", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Edit Profile",
    userdata: req.session.user,
    role : req.session.user.role
  });
};

exports.account_setting = async (req, res, next) => {
  res.render("general/account-setting", {
    pageTitle: "E-Health Dashboard",
    pageHeader: "Account Setting",
    userdata: req.session.user,
    role : req.session.user.role
  });
};