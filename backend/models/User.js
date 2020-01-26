const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  imageUrl: { type: String },
  places: [{ type: Schema.Types.ObjectId, required: true, ref: "Place" }]
  //one user can have multiple places so []
});

userSchema.plugin(uniqueValidator);

//unique: only creates internal index in db to make email query faster
//muv : makes sure we can only create new user if email don't exist already i.e unique email
module.exports = model("User", userSchema); //model name turns to collection name i.e places
