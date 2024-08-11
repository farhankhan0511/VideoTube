import mongoose, { mongo } from "mongoose";
import { Tweets } from "../models/Tweets.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHnadler } from "../utils/asyncHandler.js";


const CreateTweet=asyncHnadler(async(req,res)=>{
    const Owner=req.user
    const {content}=req.body;

    console.log(req.user)
    console.log(req.body)

    if(!Owner){
        throw new ApiError(400,"Only login User can tweet")
    }
    
    
    if(!content){
        throw new ApiError(400,"Tweets should not be empty");
    }
    const Tweet=await Tweets.create({
        content:content,
        Owner:Owner
    })
    
    if(!Tweet){
        throw new ApiError(500,"Tweet not uploaded")
    }
    res.status(200).json(
        new ApiResponse(200,Tweet,"Tweeted Successfully")
    )




})
const UpdateTweet=asyncHnadler(async(req,res)=>{
    const {tweetid}=req.query;
    const{content}=req.body
    if(!content){
        throw new ApiError(400,"Give the new content")
    }
    const updatedTweet=await Tweets.findByIdAndUpdate(tweetid,{
        $set:{
            content:content
        }
    },{
        new:true
    })
    if(!updatedTweet){
        throw new ApiError(500,"Error while updating the tweet")
    }
    res.status(200).json(
        new ApiResponse(200,updatedTweet,"Tweet Updated Successfully")
    )

})
const DeleteTweet=asyncHnadler(async(req,res)=>{
    const {tweetid}=req.query

    if(!tweetid){
        throw new ApiError(400,"Tweet doesn't exist")

    }
    await Tweets.findByIdAndDelete(tweetid)
    res.status(200).json(
        new ApiResponse(200,{},"Tweet deleted Successfully")
    )

})

const getUserTweets=asyncHnadler(async(req,res)=>{
    const user=req.user
    
    if(!user){
        throw new ApiError(400,"Please login to see your tweets")
    }

    const getTweets= await Tweets.aggregate([
        {$match:{
            Owner: new mongoose.Types.ObjectId(user)
        }}
    ])

    if(!getTweets){
        throw new ApiError(500,"Failed to get the user tweets")
    }
    console.log(getTweets)
    res.status(200).json(
        new ApiResponse(200,getTweets,"User Tweets fetched Successfully")
    )
})
    
export {CreateTweet,DeleteTweet,UpdateTweet,getUserTweets}

