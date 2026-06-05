// Mongoose Package
const mongoose = require("mongoose");

// Model Required listing
const Listing = require("../models/listing.js");

const review = require("../models/reviews.js");

// required the data.js
const instData = require("./data.js");

// Mongoose Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb");
    console.log(`MongoDB is Connected ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB is Not Connected ${err.message}`);
  }
};

const initDB = async () => {
  await Listing.deleteMany({});
  await review.deleteMany({});
  await await Listing.insertMany(instData.data);
  console.log("Old Data is Deleted");
  console.log("And New Data is Inserted");
};

const main = async () => {
  await connectDB();
  await initDB();
};

main();
