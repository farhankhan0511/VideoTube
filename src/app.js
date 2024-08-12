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
import videoRouter from './routes/Video.routes.js'
import commentsrouter from './routes/Comments.router.js'

import tweetsRouter from './routes/Tweet.router.js'
import likesrouter from './routes/Likes.router.js'
import playlistrouter from "./routes/Playlist.routes.js"
import subscriptionrouter from "./routes/Subscription.routes.js"

// routes declaration

app.use("/users",userRouter)



app.use("/videos",videoRouter)

app.use("/videos",commentsrouter)
app.use("/videos",likesrouter)
app.use("/Tweets",tweetsRouter)
app.use("/Tweets",likesrouter)
app.use("/Playlist",playlistrouter)
app.use("/Channel",subscriptionrouter)


export default app;