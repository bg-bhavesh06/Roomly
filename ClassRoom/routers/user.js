const express = require("express");
const router = express.Router(); // this .Router(); is build-in method inthe express.
// That return the Router Object.
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
