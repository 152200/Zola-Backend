const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();


// Define the directory path
const publicUploadsDir = path.join(__dirname, "public/uploads");
// hello
try {
  // Ensure the directory exists
  if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
  }

  // Set read/write/execute permissions for everyone
  fs.chmodSync(publicUploadsDir, 0o777); 
  console.log("Directory permissions updated successfully");
} catch (error) {
  console.error("Error setting permissions:", error.message);
}


if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

app.use("/public/uploads", express.static(publicUploadsDir));

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
