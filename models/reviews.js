const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema({
  Comment: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Review = mongoose.model("Review", ReviewsSchema);
module.exports = Review;
