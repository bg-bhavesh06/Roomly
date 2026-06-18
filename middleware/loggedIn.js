module.exports.isLoggin = (req, res, next) => {
  console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    req.flash("show", "You Must login");
    return res.redirect("/auth/login");
  } else {
    next();
  }
};
