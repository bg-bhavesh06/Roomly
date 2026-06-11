// Express Package
const express = require("express");
const app = express();

//Port Number..
let port = 8080;

//localhost Linke
let link = "http://localhost:8080/listings";

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

//mongodb is started
connectDB();

//Requires the Routes
const listingRoutes = require("./router/listing.js"); //require the listing's route
const reviewRoutes = require("./router/review.js"); //require the Review's Route

// home Route...
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//Using the Route
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

app.listen(port, () => {
  console.log("server is Listen : " + link);
});
