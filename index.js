const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();



app.use("/uploads", express.static('uploads'));

// Middleware
app.use(
  cors({
    origin: [
      process.env.ORIGIN1,
      process.env.ORIGIN2,
      process.env.ORIGIN3,
      process.env.ORIGIN4,
    ],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const newOrderRoutes = require("./routes/newOrder");

app.use(`/categories`, categoriesRoutes);
app.use(`/products`, productsRoutes);
app.use(`/users`, usersRoutes);
app.use(`/orders`, ordersRoutes);
app.use("/webhook", newOrderRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "Zola-Sook",
  })
  .then(() => {
    console.log("Connected to database!");

    app.listen(3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
