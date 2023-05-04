//User Model Section  -->  (MVC)

const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    avtar:{
        publicId:String,
        url:String
    },
    followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"user"
            }],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }]    
});

module.exports = mongoose.model('user', userSchema);