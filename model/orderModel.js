import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = new Schema({
    Customer:String, 
    PurchaseDate: Date,
    Coupon:{
        _id: {
          type:String,
          default:null
        },
    },
    DetailCart: [{
        Book: {
          _id: {
            type:String,
            required: true
          },
        },
        Price: {
          type: Number,
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