//Post Model Section  -->  (MVC)

const mongoose=require("mongoose");

const PostSchema=mongoose.Schema({
    
    owner:
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"user",
                required:true
            }
    ,
    image:
            {
                publicId:String,
                url:String
            },
    caption:
    {
        type:String,
        required:true
    }
    ,
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]

});

module.exports = mongoose.model('post', PostSchema);