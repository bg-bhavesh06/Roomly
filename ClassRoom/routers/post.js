const express = require("express");

// That return the Router Object.
// this .Router(); is build-in method in the express.
const router = express.Router();

//Post Rouet's

//index-route
router.get("/", (req, res) => {
  res.send("hii I am a Post ");
});

//show-Route
router.get("/:id", (req, res) => {
  res.send("post id is showing");
});

//post-route
router.post("/", (req, res) => {
  res.send("post for the user");
});

//delete-route
router.delete("/:id", (req, res) => {
  res.send("post id is deleted");
});

module.exports = router;
