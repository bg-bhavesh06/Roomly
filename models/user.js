const mongoose = require("mongoose");

//Require the mongoose-local
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
});

//autiomatical create(username) and insert the username + hash + salt and passpord stored in hash field
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
