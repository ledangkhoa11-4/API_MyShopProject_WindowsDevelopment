import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema({
    Username: {type: String,              
                required: true, 
                unique: true},
    Password: {type: String,              
        required: true, 
        unique: true},   // Password phải được hash
    });
    
let categoryModel = mongoose.model('Categories', CategorySchema,"Categories");


export default categoryModel