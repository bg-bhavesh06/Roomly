// Mongoose Package
const mongoose = require("mongoose");

let URI = process.env.MONGO_URL;
// Mongoose Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB is Connected ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB is Not Connected ${err.message}`);
  }
};

module.exports = { connectDB };
