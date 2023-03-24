const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const FruitSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  number_in_stock: { type: String, min:0, required: true },
});

// Virtual for fruit's URL
FruitSchema.virtual("url").get(function () {
return `/catalog/fruit/${this._id}`;
});

// Compile model from schema
module.exports = mongoose.model("Fruit", FruitSchema);
