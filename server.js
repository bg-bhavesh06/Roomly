// Express Package
const express = require("express");
const app = express();

//Port Number..
let port = 8080;

//localhost Linke
let link = "http://localhost:8080/listings";

// Mongoose Package
const mongoose = require("mongoose");

//Method-override Package
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Views Folder..
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Ejs-Mate Pcakage
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//public folder
app.use(express.static(path.join(__dirname, "/public")));

//Parse the data
app.use(express.urlencoded({ extended: true }));

// Model Required listing
const Listing = require("./models/listing.js");

//Model Required reviews...
const Review = require("./models/reviews.js");

//Custome Error class
const ExpressError = require("./utils/CustomError.js");

//WrapAsync Error
const WrapAsync = require("./utils/wrapAsync.js");

//Server side Validation Schema's
const { ListingSchema, ReviewSchema } = require("./schema.js");

// Mongoose Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb");
    console.log(`MongoDB is Connected ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB is Not Connected ${err.message}`);
  }
};
connectDB();

//Mongoose Meddleware...

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

// // listing Route
// app.get("/DemoListing", async (req, res) => {
//   const SampleData = new Listing({
//     title: "My new Villa",
//     description: "By the biche",
//     price: 12000,
//     location: "Goa",
//     country: "India",
//   });
//   const saved = await SampleData.save();
//   console.log("sample was saved", saved);
//   res.send("sample data insrted");
// });

// home Route...
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// display the list route-A...
app.get(
  "/listings",
  WrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //
    res.render("listing/allListing.ejs", { allListing });
    // console.log(allListing);
  }),
);

//creat list Route-C1
app.get("/listings/new", (req, res) => {
  res.render("listing/creatList.ejs");
});

// show Listing Route-B...
app.get(
  "/listings/:Listid",
  WrapAsync(async (req, res, next) => {
    const { Listid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(Listid)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    const List = await Listing.findById(Listid).populate("reviews");
    if (!List) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }
    res.render("listing/show.ejs", { List });
  }),
);

//Add in the list Route-C2...
app.post(
  "/listings",
  serverValidateListings,
  WrapAsync(async (req, res) => {
    //this is the long way make the this valuse by Listing objest in creatList.ejs
    // const {title,discription,image,price,location,country} = req.body
    const alllist = new Listing(req.body.Listing);
    await alllist.save();
    res.redirect("/listings");
  }),
);

// get the value's to Update route-D1
app.get(
  "/listings/:Listid/edit",
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
app.put(
  "/listings/:Listid",
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
    res.redirect("/listings");
  }),
);

//Delete Route-E...
app.delete(
  "/listings/:ListId/",
  WrapAsync(async (req, res, next) => {
    const { ListId } = req.params;
    console.log(ListId);
    if (!mongoose.Types.ObjectId.isValid(ListId)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    // await Review.findByIdAndUpdate( {});
    let deleted = await Listing.findByIdAndDelete(ListId);
    if (!deleted) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.redirect("/listings");
  }),
);

//Adding the Review Route to connect the listing Modle Route- F
app.post(
  "/listings/:Listid/review",
  serverValidateReviews,
  WrapAsync(async (req, res) => {
    let rev = await Listing.findById(req.params.Listid); //Get that List that user clicked..
    // console.log(rev);

    let newReview = new Review(req.body.reviews); //inserting the review Data inthe Review Model...
    console.log(newReview);

    rev.reviews.push(newReview);

    await newReview.save(); //wait for adding the reviews data in the reviews Model
    let ans = await rev.save();
    // console.log(ans);
    res.redirect(`/listings/${rev._id}`);
  }),
);

//Delete The Review Route-G
app.delete(
  "/listings/:Listid/reviews/:Reviewid/delete",
  WrapAsync(async (req, res) => {
    let { Listid, Reviewid } = req.params;

    let DeletedReview = await Review.findByIdAndDelete(Reviewid);
    // console.log(DeletedReview);

    //in this why we can replace to write the Mongoose middleware... with ($pull)Operator
    await Listing.findByIdAndUpdate(Listid, { $pull: { reviews: Reviewid } });

    res.redirect(`/listings/${Listid}`);
  }),
);

app.use((req, res) => {
  res.status(404).render("listing/PageError.ejs");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).render("./listing/middlewareError.ejs", { message });
});

app.listen(port, () => {
  console.log("server is Listen : " + link);
});
