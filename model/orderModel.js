import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = new Schema({
    Customer:String, 
    PurchaseDate: Date,
    Coupon:{
        type:String,
        default:null
    },
    DetailCart: [{
        Book: {
          type: String,
          required: true
        },
        QuantityBuy: {
          type: Number,
          required: true
        },
        TotalPrice: {
          type: Number,
          required: true
        }
    }],
    TotalPriceOrder: Number,
    });
    
let orderModel = mongoose.model('Orders', OrderSchema,"Orders");
export default orderModel