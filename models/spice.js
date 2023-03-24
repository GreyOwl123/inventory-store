const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const SpiceSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  number_in_stock: { type: String, min:0, required: true },
});

// Virtual for spice's url.
SpiceSchema.virtual("url").get(function () {
  return `/catalog/spice/${this._id}`;
});

// Compile model from schema
module.exports = mongoose.model("Spice", SpiceSchema);
