import mongoose from "mongoose";

const TweetsSchema= new mongoose.Schema({
    content:{
        type:"String",
        maxlength:[3000,"Tweets should not exceed more than 3000 characters"],
        required:true,
        
    },
    Owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Tweets=mongoose.model("Tweets",TweetsSchema)