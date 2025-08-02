
const mongoose=require('mongoose');
const userschema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    contact:String,
    gender:String,
    address:String
   
})
module.exports=mongoose.model('user',userschema);

