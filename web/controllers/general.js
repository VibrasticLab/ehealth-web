exports.home = async (req, res, next) => {
  res.render("general/home", {
    pageTitle: "Elefante Dashboard",
  });
};

exports.edit_profile = async (req, res, next) => {
  res.render("general/edit-profile", {
    pageTitle: "Elefante Dashboard",
  });
};

exports.account_setting = async (req, res, next) => {
  res.render("general/account-setting", {
    pageTitle: "Elefante Dashboard",
  });
};