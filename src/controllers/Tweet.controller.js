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

    
export {CreateTweet}

