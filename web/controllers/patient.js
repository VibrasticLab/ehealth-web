exports.home = async (req, res, next) => {
  res.render("patient/home-patient", {
    pageTitle: "Elefante Dashboard",
  });
};
