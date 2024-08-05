import dotenv from "dotenv"
dotenv.config();

import connectDB from "./db/db.js";
import app from "./app.js";



connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR",error);
        throw error;
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Mongodb not connected",err)
    
})











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