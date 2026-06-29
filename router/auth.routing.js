const express = require("express");
//user Model
const User = require("../models/user.js");
const passport = require("passport");
const WrapAsync = require("../utils/wrapAsync.js");

//this help user to navigate the privouly page that user selectd before login (Add New Listing)
const { SaveCurrentUrl } = require("../middleware/checking.js");

// That return the Router Object.
// this .Router(); is build-in method in the express.
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("auth/signup.ejs");
});

router.post(
  "/signup",
  WrapAsync(async (req, res, next) => {
    try {
      const { username, password, gmail } = req.body;
      const user1 = new User({ username, gmail });

      let registredUser = await User.register(user1, password);
      req.login(registredUser, (err) => {
        if (err) {
          return next(err);
        } else {
          // console.log(registredUser);
          //in this way we sand the short-Msg to user. tha remove automaticaly after first refereshPage
          req.flash("show", "Successfuly SignUp"); //this redirect is mandantri to decied's where we have to display the msg main's which route
          res.redirect("/listings");
        }
      });
      req.session.isLoggedIn = true;
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/auth/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});

router.post(
  "/login",
  //passport don't have the access of the locals
  //(SaveCurrentUrl) this decied's after the login where the uer is trave(Add New Listing)
  SaveCurrentUrl,
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: {
      type: "show",
      message: "Invalid username or password",
    },
  }),
  async (req, res) => {
    req.flash("show", "Login success");
    // console.log(req.user);
    // console.log(res.locals.CurrentUrl);

    //this logice help us to redirect that page that user selected main(Add New Listing).
    //before the login to redirect that seleced page (add New list) after login successfuly
    const url = res.locals.CurrentUrl || "/listings";
    delete req.session.redirectUrl;
    req.session.isLoggedIn = true;
    console.log("This the login Path");
    console.log(res.locals.CurrentUrl);
    res.redirect(url);
  },
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("show", "LogOut Success");
    res.redirect("/listings");
  });
});
module.exports = router;
