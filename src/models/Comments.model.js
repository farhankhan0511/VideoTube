import mongoose from "mongoose";

const CommentsSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
        maxlength:2000
    }
,   video:{
    type:mongoose.Schema.Types.ObjectId
    ,ref:"Video"
},
owner:{
    type:mongoose.Schema.Types.ObjectId
    ,ref:"User"
}
},
    {timestamps:true})



export const Comments=mongoose.model("Comments",CommentsSchema)