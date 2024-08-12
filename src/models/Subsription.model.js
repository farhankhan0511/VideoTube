import { Schema } from "mongoose";
import mongoose from "mongoose";

const SubsriptionSchema=new Schema({

    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    Channel:{
type:Schema.Types.ObjectId,
ref:"User"
    },
    
}
    ,{timestamps:true})

export const Subscription= mongoose.model("Subscription",SubsriptionSchema)