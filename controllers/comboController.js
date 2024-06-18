// backend/controllers/comboController.js
const Combo = require("../models/comboModel");
const Product = require("../models/productModel");
const joi = require("joi");

// Get all combos
const getCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate("products");
    return res.json(combos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single combo by ID
const getComboById = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate("products");
    if (combo) {
      return res.json(combo);
    } else {
      return res.status(404).json({ message: "Combo not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new combo
const createCombo = async (req, res) => {
  const { productIds, comboPrice } = req.body;

  try {
    // Ensure all products exist

    // body validation
    const schema = joi.object({
      productIds: joi.array().items(joi.string()).min(2).max(2),
      comboPrice: joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((d) => d.message)[0].replace(/"/g, ""),
      });
    }

    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Some products do not exist" });
    }

    const newCombo = new Combo({
      products: productIds,
      comboPrice,
    });

    const savedCombo = await newCombo.save();
    return res.status(201).json(savedCombo);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Update an existing combo
const updateCombo = async (req, res) => {
  const { id } = req.params;
  const { productIds, comboPrice } = req.body;

  try {
    // Ensure all products exist

    const schema = joi.object({
      productIds: joi.array().items(joi.string()).min(2).max(2),
      comboPrice: joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((d) => d.message)[0].replace(/"/g, ""),
      });
    }

    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Some products do not exist" });
    }

    const combo = await Combo.findById(id);
    if (combo) {
      await Combo.updateOne(
        { _id: req.params.id },
        {
          $set: { products: productIds, comboPrice },
        }
      );
      return res.json({ message: "Combo Offer update successfully." });
    } else {
      return res.status(404).json({ message: "Combo not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a combo
const deleteCombo = async (req, res) => {
  const { id } = req.params;

  try {
    const combo = await Combo.findById(id);
    if (combo) {
      await Combo.deleteOne({ _id: id });
      return res.json({ message: "Combo Offer deleted" });
    } else {
      return res.status(404).json({ message: "Combo not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCombos,
  getComboById,
  createCombo,
  updateCombo,
  deleteCombo,
};
