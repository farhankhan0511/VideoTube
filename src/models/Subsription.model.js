import { Schema } from "mongoose";
import mongoose from "mongoose";

const SubsriptionSchema=new Schema({

    subscribers:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channelOwner:{
type:Schema.Types.ObjectId,
ref:"User"
    },
    
}
    ,{timestamps:true})

export const Subscription= mongoose.model("Subscription",SubsriptionSchema)