import mongoose from 'mongoose';
const { Schema } = mongoose;

const AccountSchema = new Schema({
    Username: {type: String,              
                required: true, 
                unique: true},
    Password: {type: String,              
        required: true, 
        unique: true},   // Password phải được hash
    });
    
let accountModel = mongoose.model('Accounts', AccountSchema,"Accounts");


export default accountModel