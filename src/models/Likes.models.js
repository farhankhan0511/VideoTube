import mongoose from "mongoose";


const LikesSchema=new mongoose.Schema({
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        
        
    },
    likedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
                
    },
    Tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweets"
    },
    Comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comments"
    }

},
    {timestamps:true})

export const Likes=mongoose.model("Likes",LikesSchema)