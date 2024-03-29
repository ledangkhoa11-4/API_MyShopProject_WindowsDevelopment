import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProductSchema = new Schema({
    Name: String, // String is shorthand for {type: String}
    ImageBase64: String,
    PurchasePrice: Number,
    SellingPrice: Number,
    Author: String,
    PublishedYear: Number,
    QuantityStock: Number,
    QuantityOrder: Number,
    IsOnStock:Boolean,
    CatID:{
        type: String,
        required: true
    },
    Description:String,
   
    });
    
let productModel = mongoose.model('Books', ProductSchema,"Books");
export default productModel