import mongoose from 'mongoose';
const { Schema } = mongoose;

const CouponSchema = new Schema({
    Name: {
        required: true,
        type: String}, 
    DiscountPercent:  {
        required: true,
        type: Number},
    DateAdd:{
        type: Date,
        default: () => Date.now()
    }
    });
    
let couponModel = mongoose.model('Coupons', CouponSchema,"Coupons");
export default couponModel