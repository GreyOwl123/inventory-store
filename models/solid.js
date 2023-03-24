const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const SolidSchema = new Schema({
 name: String,
  description: String,
  price: Number,
  number_in_stock: { type: String, min:0, required: true },
});

// Virtual for solid's URL.
SolidSchema.virtual("url").get(function () {
  return `/catalog/solid/${this._id}`;
});

// Compile model from schema
module.exports = mongoose.model("Solid", SolidSchema);
