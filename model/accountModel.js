import mongoose from 'mongoose';
const { Schema } = mongoose;

const AccountSchema = new Schema({
    Username: {type: String,              
                required: true, 
                unique: true},
    Password: {type: String,              
        required: true, 
        },   // Password phải được hash
    Salt: {type: String,
        required: true,
        },
    });
    
    
let accountModel = mongoose.model('Accounts', AccountSchema,"Accounts");


export default accountModel