const express = require("express");

// Mongoose Package
const mongoose = require("mongoose");

// That return the Router Object.
// this .Router(); is build-in method in the express.
const router = express.Router();

// Model Required listing
const Listing = require("../models/listing.js");

//Custome Error class
const ExpressError = require("../utils/CustomError.js");

//WrapAsync Error
const WrapAsync = require("../utils/wrapAsync.js");

//Server side Validation Schema's
const { ListingSchema } = require("../schema.js");

//middleware access...
const { isLogginList, isAccessList } = require("../middleware/checking.js");

//use multer to parese the file/image like data...
const multer = require("multer");
//this way we export the basic setup...in (../config/cloudinary.js)
const { storage } = require("../config/cloudinary.js");
//the (storage) = we passeed inside multer...
const upload = multer({ storage });

//server validate function for listings.(Comming Form PostMan and Hocpcsock)
function serverValidateListings(req, res, next) {
  let { error, value } = ListingSchema.validate(req.body);

  if (error && value) {
    console.dir(error);
    console.dir(value);
    let errMsg = error.details[0].message;
    console.log(errMsg);
    return next(new ExpressError(400, errMsg));
  } else {
    next();
  }
}

//listing routes

// display the list route-A...
router.get(
  "/",
  WrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //
    res.render("listing/allListing.ejs", { allListing });
    // console.log(allListing);
  }),
);

//creat list Route-C1
router.get("/new", isLogginList, (req, res) => {
  res.render("listing/creatList.ejs");
});

//Add in the list Route-C2...
router.post(
  "/",
  isLogginList,
  // serverValidateListings,
  upload.single("Listing[image]"),
  WrapAsync(async (req, res) => {
    //this is the long way make the this valuse by Listing objest in creatList.ejs
    // const {title,discription,image,price,location,country} = req.body
    const alllist = new Listing(req.body.Listing);

    //this will help to inser the image to database..
    const { path: url, filename: filename } = req.file;
    //we have to right the same name that we define in the schema
    alllist.image = { url, filename };

    // this help to add the owner that user is alwready login
    alllist.owner = req.user._id;

    await alllist.save();

    //in this way we sand the short-Msg to user. tha remove automaticaly after first refereshPage
    req.flash("show", " New Listing is Added");
    res.redirect("/listings"); //this redirect is mandantri to decied's where we have to display the msg main's which route
  }),
);
// router.post("/", upload.single("Listing[image]"), (req, res) => {
//   res.send(req.file);
// });

// show Listing Route-B...
router.get(
  "/:Listid",
  WrapAsync(async (req, res, next) => {
    const { Listid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(Listid)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    const List = await Listing.findById(Listid)

      //With .populate(User) help to display the all users data instant of only showing it's ( _id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!List) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }
    res.render("listing/show.ejs", { List });
  }),
);

// get the value's to Update route-D1
router.get(
  "/:Listid/edit",
  isLogginList,
  isAccessList,
  WrapAsync(async (req, res, next) => {
    const { Listid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(Listid)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }

    const alllist = await Listing.findById(Listid);
    // console.log(alllist);
    if (!alllist) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }
    res.render("listing/edit.ejs", { alllist });
  }),
);

//Updated List Route-D2...
router.put(
  "/:Listid",
  isLogginList,
  isAccessList,
  serverValidateListings,
  WrapAsync(async (req, res, next) => {
    const { Listid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(Listid)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    const updated = req.body.Listing;
    const ans = await Listing.findByIdAndUpdate(Listid, updated, { new: true });

    if (!ans) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }
    console.log(ans);
    //in this way we sand the short-Msg to user. tha remove automaticaly after first refereshPage
    req.flash("show", "Listing is Updated"); //this redirect is mandantri to decied's where we have to display the msg main's which route
    res.redirect("/listings");
  }),
);

//Delete Route-E...
router.delete(
  "/:Listid",
  isLogginList,
  isAccessList,
  WrapAsync(async (req, res, next) => {
    const { Listid } = req.params;
    console.log(Listid);
    if (!mongoose.Types.ObjectId.isValid(Listid)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    // await Review.findByIdAndUpdate( {});
    let deleted = await Listing.findByIdAndDelete(Listid);
    if (!deleted) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    //in this way we sand the short-Msg to user. tha remove automaticaly after first refereshPage
    req.flash("show", " Existence list deleted Successfully");

    res.redirect("/listings");
  }),
);

module.exports = router;
