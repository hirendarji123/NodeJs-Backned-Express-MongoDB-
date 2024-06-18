const Product = require("../models/productModel");
const joi = require("joi");

//create product
const createProduct = async (req, res) => {
  try {
    // body validation
    const schema = joi.object({
      name: joi.string().required(),
      mainPrice: joi.number().required(),
      discountedPrice: joi.number().required(),
      description: joi.string().max(255).optional(),
      imageUrl: joi.string().required(),
      productDetails: joi.object().optional(),
      productStart: joi.number().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((d) => d.message)[0].replace(/"/g, ""),
      });
    }

    const {
      name,
      mainPrice,
      discountedPrice,
      description,
      imageUrl,
      productDetails,
      productStart,
    } = req.body;

    const newProduct = new Product({
      name,
      mainPrice,
      discountedPrice,
      description,
      imageUrl,
      productDetails,
      productStart,
    });

    await newProduct.save();

    return res.status(201).json({ message: "Product created successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const totalCount = await Product.countDocuments();

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return res.json({
      message: "Data fetched successfully",
      data: products,
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json({ message: "Fetched data successfully.", data: product });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // body validation
    const schema = joi.object({
      name: joi.string().optional(),
      mainPrice: joi.number().optional(),
      discountedPrice: joi.number().optional(),
      description: joi.string().max(255).optional(),
      imageUrl: joi.string().optional(),
      productDetails: joi.object().optional(),
      productStart: joi.number().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((d) => d.message)[0].replace(/"/g, ""),
      });
    }
    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    res.json({
      message: "Data updated successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne({ _id: req.params.id });
    return res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
