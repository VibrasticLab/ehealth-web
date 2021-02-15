exports.home = async (req, res, next) => {
  res.render("patient/home-patient", {
    pageTitle: "E-Health Dashboard",
    role : req.session.user.role
  });
};
