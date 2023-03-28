import mongoose from 'mongoose';
const { Schema } = mongoose;

const PromotionSchema = new Schema({
    PromotionID: {type: Number,              //ID Phải tự tăng
                required: true, 
                unique: true},
    Name: String, 
    DiscountPercent: Number,
    Description:String
    });
    
let promotionModel = mongoose.model('Promotions', PromotionSchema,"Promotions");
export default promotionModel