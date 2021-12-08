exports.home = async (req, res, next) => {
  res.render("patient/home-patient", {
    pageTitle: "E-Health Dashboard",
    userdata: req.session.user,
    role : req.session.user.role
  });
};
