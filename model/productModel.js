import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProductSchema = new Schema({
    BookID: {type: Number,              //ID Phải tự tăng
                required: true, 
                unique: true},
    Name: String, // String is shorthand for {type: String}
    PurchasePrice: Number,
    SellingPrice: Number,
    Author: String,
    PublishedYear: Number,
    Quantity: Number,
    CatID:{
        type: Number,
        required: true
    },
    Description:String,
    Cover:String
    });
    
let productModel = mongoose.model('Products', ProductSchema,"Products");
export default productModel