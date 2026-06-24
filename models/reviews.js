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
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Review = mongoose.model("Review", ReviewsSchema);
module.exports = Review;
