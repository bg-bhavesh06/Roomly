// Express Package
const express = require("express");
const app = express();

//Port Number..
let port = 8080;

//localhost Linke
let link = "http://localhost:8080/erp";

//require the Express-Session...
const session = require("express-session");

//require the connect-flash for display the short msg to user
const flash = require("connect-flash");
//reqired the Mongodb Connection
const { connectDB } = require("./config/db.js");

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

//Declared the Session to use in the app's
app.use(
  session({
    secret: "bhaveshIsThePowerFull",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  }),
);

//method to use the flash
app.use(flash());

//use the flash middleware to use the flash..
app.use((req, res, next) => {
  res.locals.showMsg = req.flash("show");
  next();
});

//Requires the Routes
const listingRoutes = require("./router/listing.js"); //require the listing's route
const reviewRoutes = require("./router/review.js"); //require the Review's Route

// home Route...
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRoutes);
app.use("/listings/:Listid/reviews", reviewRoutes);

app.use((req, res) => {
  res.status(404).render("listing/PageError.ejs");
});

//Globale middleWare
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).render("./listing/middlewareError.ejs", { message });
  // next()
});

if (require.main === module) {
  //mongodb is started
  connectDB();

  app.listen(port, () => {
    console.log("server is Listen : " + link);
  });
}

module.exports = app;
