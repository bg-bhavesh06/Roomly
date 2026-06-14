// Model Required listing
const Listing = require("../models/listing.js");
const review = require("../models/reviews.js");

//reqired the Mongodb Connection
const { connectDB } = require("../config/db.js");

// required the data.js
const instData = require("./data.js");

// Mongoose Connection
connectDB();

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
