import mongoose from "mongoose";
import { Likes } from "../models/Likes.models.js";
import { Subscription } from "../models/Subsription.model.js";
import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";


const getChannelVideos=asyncHnadler(async(req,res)=>{
    const user=req.user
    if(!user){
        throw ApiError(400,"Please Login")
    }
    const Videos=await Video.aggregate([
        {
            $match:{
                Owner:new mongoose.Types.ObjectId(user._id)
            }
        },{
            $lookup:{
                from:"likes",
                localField:"_id"
                ,foreignField:"video",
                as:"likes"
            }
        },{
            $addFields:{
                likes:{
                    $size:"$likes",
                }
            }
        }
    ])
    if(!Videos){
        throw new ApiError(500,"Something went wrong while fetching videos")
    }
    console.log(Videos)
    res.status(200).json(
        new ApiResponse(200,Videos,"Videos fetched Successfully")
    )
    
})

const getChannelStats=asyncHnadler(async(req,res)=>{
    const user=req.user._id

    if(!user){
        throw ApiError(400,"Login required")
    }
    const response=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(user)
            }
        },{
            $project:{
                fullname:1,
                username:1,
                avatar:1
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"Owner",
                as:"Videoinfo",
                pipeline:[
                    {
                        $group:{
                            _id:"",
                            views:{
                                $sum:"$views"
                            }
                        }
                    },{
                        $project:{
                            views:"$views",
                            _id:0

                        }
                    }
                ]
            }
        },{
            $addFields:{
                Videoinfo:{
                    $first:"$Videoinfo"
                }
            }
        },{
            $lookup:{
                from:"subscriptions"
                ,localField:"_id",
                foreignField:"Channel",
                as:"Subscribersinfo"
            }
        },{
            $addFields:{
                Subscribersinfo:{
                    $size:"$Subscribersinfo"
                }
            }
        }
    ])


   
    res.status(200).json(
        new ApiResponse(200,response,"Successfull")
    )






})


export {getChannelVideos,getChannelStats}