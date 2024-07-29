require('dotenv').config()
const express=require("express");

const app=express()

app.get("/",(req,res)=>{
    res.send("<h1>HEy Fellas</h1>")
})

app.listen(process.env.PORT,()=>{
    console.log(`WE are currently at port ${process.env.PORT}`)
})