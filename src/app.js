import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true,
    }
))


app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({exteded:true,limit:'16kb'}))
app.use(express.static("public"));
app.use(cookieParser())


//routes import

import userRouter from './routes/User.routes.js'

// routes declaration

app.use("/users",userRouter)

import videoRouter from './routes/Video.routes.js'


app.use("/videos",videoRouter)

import tweetsRouter from './routes/Tweet.router.js'
app.use("/Tweets",tweetsRouter)

























export default app;