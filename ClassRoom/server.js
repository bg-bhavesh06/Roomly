const express = require("express");
const app = express();

const usersRoutes = require("./routers/user.js"); //require the user's Route.
const postsRoutes = require("./routers/post.js");

let port = 3000;

//Now suppose that we have two models (Post and User's)
//Now for both the model's we are trying to define some Route..

app.get("/", (req, res) => {
  res.redirect("/users");
});

//user Rouet's
app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

app.listen(port, () => {
  console.log("server is Listen On " + port);
});
