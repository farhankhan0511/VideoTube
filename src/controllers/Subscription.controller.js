import { Subscription } from "../models/Subsription.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHnadler } from "../utils/asyncHandler.js";

const ToggleSubscription=asyncHnadler(async(req,res)=>{
    const {channelid}=req.params
    const user=req.user
    const Channel=await User.findById(channelid)
    console.log(Channel)
    if(!Channel){
        throw new ApiError(400,"Channel doesnt exist")
    }
    let Subscribed=await Subscription.findOne({Channel:channelid,subscriber:user})
    if(Subscribed){
        await Subscription.findOneAndDelete({Channel:channelid,subscriber:user})
        Subscribed=null
    }
    else{
        Subscribed=await Subscription.create({
            subscriber:user,
            Channel:channelid
        })
        if(!Subscribed){
            throw new ApiError(500,"Error in Subscribing")
        }
        
    }
    res.status(201).json(
        new ApiResponse(201,Subscribed,"Subscription Toggled Successfully")
    )

})

const getSubscribedchannels=asyncHnadler(async(req,res)=>{
    const User=req.user
    if(!User){
        throw new ApiError(400,"Please Login")
    }
    
       try{
        const UserSubscriptions=await Subscription.find({subscriber:User}).select("-subscriber")      
        res.status(200).json(
            new ApiResponse(200,UserSubscriptions,"User Subscriptions")
        )
       }
       catch(err){
        throw new ApiError(500,"Error in getting User Subscriptions",err)
       }
    
   
})

const getUserChannelSubscribers=asyncHnadler(async(req,res)=>{
    const {channelid}=req.params
    const User=req.user
    try {
        const Subscibers=await Subscription.find({Channel:channelid}).select("-Channel")
        res.status(200).json(
            new ApiResponse(200,Subscibers,"Subscribers")
        )
    } catch (error) {
        throw new ApiError(500,"Error Channel doesnt exist",err)
    }
    
})

export {ToggleSubscription,getSubscribedchannels,getUserChannelSubscribers}