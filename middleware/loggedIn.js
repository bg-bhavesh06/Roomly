//this logice is help to check that.
//whatever the user can do the action.
// Is he verified user ? or not at each and every Activity.
module.exports.isLoggin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //This logic help user to back the priviouly page before is clicked login like (Add New Listings)
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.session.redirectUrl);

    req.flash("show", "You Must login");
    return res.redirect("/auth/login");
  } else {
    next();
  }
};

//this help to to find that page that we clicked before the login example Add New Listings
//main if we clicke the (Add New List).. case1 = if user is alwady logged-in or not logein..
//if not (logged-in case) now when hi clicked the (Add New List) = then first will do login page if user not logine yet
//After that successfuly login. With this logic user automaticlay redirect to that page that user clicke before he clicked mains (Add new Listing).
module.exports.SaveCurrentUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.CurrentUrl = req.session.redirectUrl;
    // console.log("CurrentUrl" + res.locals.CurrentUrl);
  }
  next();
};
