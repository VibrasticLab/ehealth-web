exports.home = async (req, res, next) => {
  res.render("admin/home-admin", {
    pageTitle: "Elefante Dashboard",
  });
};


exports.add_doctor = async (req, res, next) => {
  res.render("admin/add-doctor", {
    pageTitle: "Elefante Dashboard",
  });
};
