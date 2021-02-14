exports.get404 = (req, res, next) => {
  res.status(404).render("error/404", {
    pageTitle: "Page Not Found",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render("error/500", {
    pageTitle: "Error!",
    isAuthenticated: req.session.isLoggedIn,
  });
};
