import dotenv from "dotenv"
dotenv.config();

import connectDB from "./db/db.js";



connectDB();











// import express from "express";

// const app=express();

// ;(async ()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       
//        app.on("error",(error)=>{
//         console.log("error",error)
//         throw error;
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(PORT)
//        })
//     }
//     catch(err){
//         console.error("Error:",err);
//         throw err;
//     }
// })();