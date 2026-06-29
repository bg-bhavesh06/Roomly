if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//this help to change the dns service for MongoDB Atls...
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Express Package
const express = require("express");
const app = express();

//Port Number..
const port = 8080;

//localhost Linke
const link = "http://localhost:8080";

//reqired the Mongodb Connection
const { connectDB } = require("./config/db.js");

//mongodb is started
connectDB();

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

//require the Express-Session...
const session = require("express-session");
//to store the session inthe MongoAtlas
const MongoStore = require("connect-mongo").default;

//Require User Model
const User = require("./models/user.js");

//public folder
app.use(express.static(path.join(__dirname, "/public")));

//Parse the data
app.use(express.urlencoded({ extended: true }));

//MongoDB URl..
const MONGO_URL = process.env.MONGO_URI;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,

    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      collectionName: "sessions",
    }),

    cookie: {
      maxAge: 1000 * 60 * 60 * 6,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

//reuired the packages for passport
const passPort = require("passport");

//local strategy username + password
const LocalStrategy = require("passport-local");

//passport.js Configation

//initizilied the passport.js
app.use(passPort.initialize());

//Mantain the user session b/w different pages
//Main the user how are changing the Tab is same or differet
app.use(passPort.session());

// use static authenticate method of model in LocalStrategy
//we used the LocalStrategy username + password
//User.authenticate() method have predefine usercheking function's
passPort.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passPort.serializeUser(User.serializeUser());
passPort.deserializeUser(User.deserializeUser());

//require the connect-flash for display the short msg to user
const flash = require("connect-flash");

//method to use the flash
app.use(flash());

//use the flash middleware to use the flash..
app.use((req, res, next) => {
  //helps to display the Success Msg
  res.locals.showMsg = req.flash("show");

  //helps to display the Error Msg.... Not impliment fully yet but we can to early
  res.locals.errorMsg = req.flash("error");

  //help to display the correct option in navbar( login, signup, logout)
  res.locals.CurrentUser = req.user;
  next();
});

//Requires the Routes
const listingRoutes = require("./router/listing.routing.js"); //require the listing's route
const reviewRoutes = require("./router/review.routing.js"); //require the Review's Route
const authRoutes = require("./router/auth.routing.js"); //require the auth's Route

// home Route...
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:Listid", reviewRoutes);

//page not Found
app.use((req, res) => {
  res.status(404).render("listing/PageError.ejs");
});

//Globale middleWare
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).render("./listing/middlewareError.ejs", { message });
});

app.listen(port, () => {
  console.log(`server is listening: ${link}`);
});

module.exports = app;

// const express = require("express");
// const app = express();

// app.get("/", (req, res) => {
//   console.log("home route is working");
// });

// app.listen(3000, () => {
//   console.log("server is running in the port on");
// });
