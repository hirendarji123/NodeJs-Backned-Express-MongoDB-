require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const productRoutes = require("./routes/productRoutes");
const comboRoutes = require("./routes/comboRoutes");

const Product = require("./models/productModel");
const ComboProducts = require("./models/comboModel");

// sample data from our static file
const { products } = require("./sampleData");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

//Routing
app.use("/api/products", productRoutes);
app.use("/api/comboProducts", comboRoutes);

// DB connection and insert sample data
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB database connected successfully.");

    //------------adding sample data---------------
    // Remove existing products
    await Product.deleteMany({});

    // Insert sample products
    await Product.insertMany(products);

    let data = await Product.find({});

    // Remove existing combo
    await ComboProducts.deleteMany({});

    // inserting sample for combo offer
    ComboProducts.insertMany([
      {
        products: [data[0]._id, data[2]._id],
        comboPrice: data[0].discountedPrice + data[2].discountedPrice,
      },
      {
        products: [data[3]._id, data[1]._id],
        comboPrice: data[3].discountedPrice + data[1].discountedPrice,
      },
    ]);
    //--------------end sample data--------------------
  })
  .catch((err) => console.log(err));

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
};

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
