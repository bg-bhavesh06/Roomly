const express = require("express");
const app = express();
const users = require("./routers/user.js"); //require the user's Route.

let port = 3000;

//Now suppose that we have two models (Post and User's)
//Now for both the model's we are trying to define some Route..

//user Rouet's
app.use("/", users);

//Post Rouet's

//index-route
app.get("/post", (req, res) => {
  res.send("hii I am a Post ");
});

//show-Route
app.get("/post/:id", (req, res) => {
  res.send("post id is showing");
});

//post-route
app.post("/post", (req, res) => {
  res.send("post for the user");
});

//delete-route
app.delete("/post/:id", (req, res) => {
  res.send("post id is deleted");
});

app.listen(port, () => {
  console.log("server is Listen On " + port);
});
