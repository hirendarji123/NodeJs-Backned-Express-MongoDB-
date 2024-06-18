const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  imageUrl: { type: String, require: true },
  description: { type: String },
  productDetails: { type: Object },
  productStart: { type: Number },
});

module.exports = mongoose.model("Product", productSchema);
