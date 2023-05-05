const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const LiquidSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  number_in_stock: { type: String, min:0, required: true },
});

//Virtual for liquid's URL
LiquidSchema.virtual("url").get(function () {
return `/catalog/liquid/${this._id}`;
});

// Compile model from schema
module.exports = mongoose.model("Liquid", LiquidSchema);

