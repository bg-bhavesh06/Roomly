const express = require("express");

// That return the Router Object.
// this .Router(); is build-in method in the express.
const router = express.Router();

//user route

// index-route
router.get("/", (req, res) => {
  res.send("hii I am a user ");
});

//show-Route
router.get("/:id", (req, res) => {
  res.send("user id is showing");
});

//post-route
router.post("/", (req, res) => {
  res.send("user is Creating");
});

//delete-route
router.delete("/:id", (req, res) => {
  res.send("user is deleted");
});

module.exports = router;
