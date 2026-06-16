const express = require("express");

// Mongoose Package
const mongoose = require("mongoose");

// That return the Router Object.
// this .Router(); is build-in method in the express.
const router = express.Router({ mergeParams: true });

// Model Required listing
const Listing = require("../models/listing.js");

//Model Required reviews...
const Review = require("../models/reviews.js");

//Custome Error class
const ExpressError = require("../utils/CustomError.js");

//WrapAsync Error
const WrapAsync = require("../utils/wrapAsync.js");

//Server side Validation Schema's
const { ReviewSchema } = require("../schema.js");

//ServerSide Validation function for reviews .(Comming Form PostMan and Hocpcsock)
function serverValidateReviews(req, res, next) {
  let { error, value } = ReviewSchema.validate(req.body);

  if (error && value) {
    console.dir(error);
    console.dir(value);
    //this is who we can display and handle the custome Error's...
    // if (value.reviews.rating > 5) {
    //   return next(new ExpressError(404, "His is not Required the Rating"));
    // }
    let errMag = error.details[0].message;
    console.log(errMag);
    return next(new ExpressError(400, errMag));
  } else {
    next();
  }
}

//Review's Route

//Adding the Review Route to connect the listing Modle Route- F
router.post(
  "/",
  serverValidateReviews,
  WrapAsync(async (req, res) => {
    const { Listid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(Listid)) {
      return next(new ExpressError(404, "ID is not Found"));
    }

    let rev = await Listing.findById(req.params.Listid); //Get that List that user clicked..
    // console.log(rev);
    if (!rev) {
      return next(new ExpressError(404, "Id is Not Found"));
    }

    let newReview = new Review(req.body.reviews); //inserting the review Data inthe Review Model...
    console.log(newReview);

    rev.reviews.push(newReview);

    await newReview.save(); //wait for adding the reviews data in the reviews Model
    let ans = await rev.save();
    console.log(ans);

    //in this way we sand the short-Msg to user. tha remove automaticaly after first refereshPage
    req.flash("show", "New Review is Added"); //this redirect is mandantri to decied's where we have to display the msg main's which route

    res.redirect(`/listings/${rev._id}`);
  }),
);

//Delete The Review Route-G
router.delete(
  "/:Reviewid/delete",
  WrapAsync(async (req, res) => {
    let { Listid, Reviewid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(Listid, Reviewid)) {
      return next(new ExpressError(404, "ID is not Found"));
    }

    //heare review data is deleted
    let DeletedReview = await Review.findByIdAndDelete(Reviewid);
    // console.log(DeletedReview);
    if (!DeletedReview) {
      return next(new ExpressError(404, "Review is not delted"));
    }

    //hear review id is deleted that present in the Listings schema
    //in this why we can replace to write the Mongoose middleware... with ($pull)Operator
    await Listing.findByIdAndUpdate(Listid, { $pull: { reviews: Reviewid } });

    //in this way we sand the short-Msg to user. tha remove automaticaly after first refereshPage
    req.flash("show", "Review is deleted Successfully"); //this redirect is mandantri to decied's where we have to display the msg main's which route
    res.redirect(`/listings/${Listid}`);
  }),
);

module.exports = router;
