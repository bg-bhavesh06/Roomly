require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

//this help to change the dns service for MongoDB Atls...
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

//reqired the Mongodb Connection
const { connectDB } = require("../config/db.js");

// Model Required listing
const Listing = require("../models/listing.js");
const review = require("../models/reviews.js");

// required the data.js
const instData = require("./data.js");

// Ensure connectDB is only called once inside main()
const initDB = async () => {
  // Delete old data at time to save time
  await Promise.all([
    Listing.deleteMany({}),
    review.deleteMany({}),
    // User.deleteMany({}),
  ]);
  console.log("Old Data is Deleted");

  //  Map through your data to insert the new key-value pair into each object
  instData.data = instData.data.map((item) => ({
    ...item, //with each and every seeds...
    owner: "6a35188d84380774a1f8aba1", // Replace with your actual key and value
    geometry: { type: "Point", coordinates: [77.209, 28.6139] },
  }));

  // Insert the newly updated data array
  await Listing.insertMany(instData.data);
  console.log("And New Data is Inserted");
};

const main = async () => {
  try {
    await connectDB(); // the database connection
    await initDB();
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

main();
