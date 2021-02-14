exports.home = async (req, res, next) => {
  res.render("doctor/home-doctor", {
    pageTitle: "Elefante Dashboard",
  });
};

exports.add_patient = async (req, res, next) => {
  res.render("doctor/add-patient", {
    pageTitle: "Elefante Dashboard",
  });
};
