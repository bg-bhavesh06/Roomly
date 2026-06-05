// Express Package
const express = require("express");
const app = express();

//localhost Linke

let link = "http://localhost:8080/Listing";

//Method-override Package
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Port no..
let port = 8080;

// Mongoose Package
const mongoose = require("mongoose");

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
  let { error } = ListingSchema.validate(req.body);

  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Incorrect id");
    return next(new ExpressError(404, "Invalid Formate"));
  }

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

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Incorrect id");
    return next(new ExpressError(404, "Invalid ID format"));
  }

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

// display the list route-A...
app.get(
  "/Listing",
  WrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //
    res.render("listing/allListing.ejs", { allListing });
    // console.log(allListing);
  }),
);

//creat list Route-C1
app.get("/Listing/new", (req, res) => {
  res.render("listing/creatList.ejs");
});

// show Listing Route-B...
app.get(
  "/Listing/:id",
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    const List = await Listing.findById(id).populate("reviews");
    if (!List) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }
    res.render("listing/show.ejs", { List });
  }),
);

//Add in the list Route-C2...
app.post(
  "/Listing",
  serverValidateListings,
  WrapAsync(async (req, res) => {
    //this is the long way make the this valuse by Listing objest in creatList.ejs
    // const {title,discription,image,price,location,country} = req.body
    const alllist = new Listing(req.body.Listing);
    await alllist.save();
    res.redirect("/Listing");
  }),
);

// get the value's to Update route-D1
app.get(
  "/Listing/:id/edit",
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    const alllist = await Listing.findById(id);
    // console.log(alllist);
    if (!alllist) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }
    res.render("listing/edit.ejs", { alllist });
  }),
);

//Updated List Route-D2...
app.put(
  "/Listing/:id",
  serverValidateListings,
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError(400, "Invalid ID format"));
    }
    const updated = req.body.Listing;
    const ans = await Listing.findByIdAndUpdate(id, updated, { new: true });

    if (!ans) {
      return next(new ExpressError(404, "Listing Is Not Found"));
    }
    console.log(ans);
    res.redirect("/Listing");
  }),
);

//Delete Route-E...
app.delete(
  "/Listing/:ListId/",
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
    res.redirect("/Listing");
  }),
);

//Adding the Review Route to connect the listing Modle Route-F1
app.post(
  "/Listing/:id/review",
  serverValidateReviews,
  WrapAsync(async (req, res) => {
    let rev = await Listing.findById(req.params.id); //Get that List that user clicked..
    // console.log(rev);

    let newReview = new Review(req.body.reviews); //inserting the review Data inthe Review Model...
    // console.log(newReview);

    rev.reviews.push(newReview);

    await newReview.save();
    let ans = await rev.save();
    console.log(ans);
    res.redirect(`/Listing/${rev._id}`);
  }),
);

//Delete The Review Route-F2
app.delete(
  "/Listing/:Listid/:Reviewid/reviews/delete",
  WrapAsync(async (req, res) => {
    let { Listid, Reviewid } = req.params;

    let DeletedReview = await Review.findByIdAndDelete(Reviewid);
    // console.log(DeletedReview);

    //in this why we can replace to write the Mongoose middleware... with ($pull)Operator
    await Listing.findByIdAndUpdate(Listid, { $pull: { reviews: Reviewid } });

    res.redirect(`/Listing/${Listid}`);
  }),
);

// home Route...
app.get("/", (req, res) => {
  res.redirect("/Listing");
});

app.use((req, res) => {
  res.status(404).render("listing/PageError.ejs");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).render("listing/middlewareError.ejs", { message });
});

app.listen(port, () => {
  console.log("server is Listen : " + link);
});
