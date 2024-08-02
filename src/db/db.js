import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";

const connectDB=async()=>{

    try{
        const connectioninst=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`${connectioninst.connection.host}`)
    }
    catch(err){
        console.log("connection error");
        process.exit(1);
    }
}
export default connectDB;