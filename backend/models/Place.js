const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  address: { type: String },
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" }
  //euta place ko creator ekjana matra hunxa
});

module.exports = model("Place", placeSchema); //should be singular & uppercase
