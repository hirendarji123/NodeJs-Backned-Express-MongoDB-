// backend/models/comboModel.js
const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema({
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  comboPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Combo", comboSchema);
