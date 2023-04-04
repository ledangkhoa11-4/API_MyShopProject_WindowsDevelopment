import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema({
    Name: {type: String,              
        required: true},
    Description: {type: String,}
    });
    
let categoryModel = mongoose.model('Categories', CategorySchema,"Categories");


export default categoryModel