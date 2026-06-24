const Listing = require("../models/listing");
const Review = require("../models/reviews");

//this logice is help to check that.
//whatever the user can do the action.
// Is he verified user ? or not at each and every Activity.
module.exports.isLoggin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //This logic help user to back the priviouly page before is clicked login like (Add New Listings)
    //User clicked we get (Add New List) URl path...
    req.session.redirectUrl = req.originalUrl;

    console.log("isLoggin is Called-MW");
    console.log(req.session.redirectUrl);

    req.flash("show", "You Must login");
    return res.redirect("/auth/login");
  }
  next();
};

//+

//this help to to find that page that we clicked before the login example Add New Listings
//main if we clicke the (Add New List).. case1 = if user is alwady logged-in or not logein..
//if not (logged-in case) now when hi clicked the (Add New List) = then first will do login page if user not logine yet
//After that successfuly login. With this logic user automaticlay redirect to that page that user clicke before he clicked mains (Add new Listing).
//we write this logic because of possport.js main passport.js don't have the access of the locals
module.exports.SaveCurrentUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.CurrentUrl = req.session.redirectUrl;
    console.log("SaveCurrentUrl is Called Mw");
    // console.log("CurrentUrl" + res.locals.CurrentUrl);
  }
  next();
};

//This logic help is this User is the Owner of list that acess For( Edit or delete functinolity)
module.exports.isAccessList = async (req, res, next) => {
  const { Listid } = req.params;
  let List = await Listing.findById(Listid);
  console.log("this is printed by the isAccess middleware");
  // console.log(List.owner);
  console.log(res.locals.CurrentUser._id);
  if (List && !List.owner.equals(res.locals.CurrentUser._id)) {
    req.flash("error", "You Not a Owner");
    return res.redirect(`/listings/${Listid}`);
  } else {
    next();
  }
};

//This logic help is this User is the Owner of Reviews that acess For(delete functinolity)
module.exports.isAccessReview = async (req, res, next) => {
  const { Listid, Reviewid } = req.params;
  let review = await Review.findById(Reviewid);
  const reviewAuthor = review ? review.author || review.owner : null;

  if (reviewAuthor && !reviewAuthor.equals(req.user._id)) {
    req.flash("error", "You Don't Have Access");
    return res.redirect(`/listings/${Listid}`);
  }

  next();
};

//this logice is help to check that.
//whatever the user can do the action with Reviews.
//is hi logged-in or not ?
module.exports.isLogginReview = (req, res, next) => {
  let { Listid } = req.params;
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = `/listings/${Listid}`;
    req.flash("show", "You Must login");
    return res.redirect("/auth/login");
  }

  next();
};
