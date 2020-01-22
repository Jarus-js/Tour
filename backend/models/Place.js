const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  address: { type: String },
  creator: { type: String, required: true }
});

module.exports = model("Place", placeSchema);//collection name i.e turns to places
