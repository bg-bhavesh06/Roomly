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

//Map configuration set-up
//we used the SDK way to convert the forwaredGeoCoding okyyy

//Get the token to set-up the client...
const mapToken = process.env.MAP_TOKEN;
//reuired the SDK form (npm install @mapbox/mapbox-sdk)...
const mapGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
//set the client...geoCodingClient...
const geocodingClient = mapGeoCoding({ accessToken: mapToken });

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

//Safe form again and again login
function saftToLogin(req, res, next) {
  if (!req.session.isLoggedIn) {
    res.redirect("/auth/login");
  }
  next();
}

//listing routes

// display the list route-A...
router.get(
  "/",
  saftToLogin,
  WrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //
    res.render("listing/allListing.ejs", { allListing });
    // console.log(allListing);
  }),
);

//display the creat list form Route-C1
router.get("/new", isLogginList, (req, res) => {
  res.render("listing/creatList.ejs");
});

//creating the listing Route-C2...
router.post(
  "/",
  saftToLogin,
  isLogginList,
  serverValidateListings,
  upload.single("Listing[image]"), //this will upload the img's file on the cloudinary
  WrapAsync(async (req, res) => {
    //the (resp) variable get the calculated location coordinates..
    const resp = await geocodingClient
      .forwardGeocode({
        query: req.body.Listing.location, //here we get the user typed location
        limit: 1,
      })
      .send();
    // Note thie mapBox return the first (lng) then (lat)
    // E=lng N=lat
    // [N=21°56'39.3, E=75°08'20.8] but normal approch is first(lat) then (lng)

    //this is the long way make the this valuse by Listing objest in creatList.ejs
    // const {title,discription,image,price,location,country} = req.body
    const alllist = new Listing(req.body.Listing);

    //this will help to inser the image to database..
    const { path: url, originalname: filename } = req.file;
    //we have to right the same name that we define in the schema
    alllist.image = { url, filename };

    // this help to add the owner that user is alwready login
    alllist.owner = req.user._id;

    //stroing the cooridinated...
    alllist.geometry = resp.body.features[0].geometry;

    const ans = await alllist.save();
    console.log(ans);

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
  saftToLogin,
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
  saftToLogin,
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
  saftToLogin,
  isLogginList,
  isAccessList,
  serverValidateListings,
  upload.single("Listing[image]"), //this will upload the img's file on the cloudinary
  WrapAsync(async (req, res, next) => {
    const { Listid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(Listid)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }

    //the (resp) variable get the calculated location coordinates..
    const resp = await geocodingClient
      .forwardGeocode({
        query: req.body.Listing.location,
        limit: 1,
      })
      .send();

    const updated = req.body.Listing;

    //stroing the cooridinated...
    updated.geometry = resp.body.features[0].geometry;

    const ans = await Listing.findByIdAndUpdate(Listid, updated, { new: true });
    // console.log(ans);

    if (!ans) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }

    if (req.file) {
      //this will help to inser the updated image to database..
      const { path: url, originalname: filename } = req.file;
      //we have to right the same name that we define in the schema
      ans.image = { url, filename };
      await ans.save();
    }

    //in this way we sand the short-Msg to user. tha remove automaticaly after first refereshPage
    req.flash("show", "Listing is Updated"); //this redirect is mandantri to decied's where we have to display the msg main's which route
    res.redirect(`/listings/${Listid}`);
  }),
);

//Delete Route-E...
router.delete(
  "/:Listid",
  saftToLogin,
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
