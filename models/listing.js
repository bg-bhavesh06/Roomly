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
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60"
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
      // Type of _id
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//Mongoose Middleware to check... if listing delete we have to delete the it review's also
listenSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    //why we (listing.reviews) beacuse we stored the _id of the each reviews in side the listing schema
  }
});

// creating the Model
const Listing = mongoose.model("Listing", listenSchema);

module.exports = Listing;
