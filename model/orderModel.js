import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = new Schema({
    OrderID: {type: Number,              //ID Phải tự tăng
                required: true, 
                unique: true},
    ListProduct: [Number], 
    TotalPrice: Number,
    Promotion: Number,
    PurchaseDate: Date,
    Customer: Number
    });
    
let orderModel = mongoose.model('Orders', OrderSchema,"Orders");
export default orderModel