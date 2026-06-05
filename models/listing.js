// Mongoose Package
const mongoose = require("mongoose");

//dought why we need to Import the  this reviews
const Review = require("./reviews");

const Schema = mongoose.Schema;

//Schema Design
const listenSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://pics.freeartbackgrounds.com/midle/Sunset_Background-898.jpg",
    set: (v) =>
      v === ""
        ? "https://pics.freeartbackgrounds.com/midle/Sunset_Background-898.jpg"
        : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//Mongoose Middleware to check... if listing delete we have to delete the it review's also
listenSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listenSchema);

module.exports = Listing;
