
const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "please enter the name !"],

    },
    quantity : {
        type : Number,
        required : true,
        default : 0,
    },
    price : {
        type : Number,
        required : true,
        default : 0,
    },
    image : {
        type : String,
        required : true

    },
},{timestamps : true});

const product = mongoose.model("Product", productSchema);

module.exports = product