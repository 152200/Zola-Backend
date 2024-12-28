const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios')
const dotenv = require('dotenv')


// const productModel = require("./models/product.model");
// const fullProductModel = require("./models/product");
// const categoryModel = require("./models/category");
// const orderItemModel = require("./models/order-item");
// const orderModel = require("./models/order");
// const userModel = require("./models/user");

const app = express();
dotenv.config()
app.use('/uploads', express.static('uploads'));

//middleware
app.use(cors(
  {
    origin: "*",
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: "*", 
  
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/tmp/uploads', express.static(__dirname + '/tmp/uploads'));

//routes
// const productRoute = require("./routes/product.route");
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const newOrderRoutes = require('./routes/newOrder');
const { CURSOR_FLAGS } = require("mongodb");

//const api = process.env.API_URL;


app.use(`/categories`, categoriesRoutes);
app.use(`/products`, productsRoutes);
app.use(`/users`, usersRoutes);
app.use(`/orders`, ordersRoutes);
app.use('/webhook', newOrderRoutes)

mongoose.connect(process.env.MONGO_URI,{
  dbName: "Zola-Sook",
})
  .then(() => {
    console.log("Connected to database!");
    
    app.listen(3000, () => {
      console.log(`Server Is Running On Port ${process.env.PORT || 3000}`);
    });
  })
  .catch(() => {
    console.log("Connection Failed");
  });
