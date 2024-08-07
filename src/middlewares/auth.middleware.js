import { ApiError } from "../utils/ApiError.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js";

export const verifyJWT=asyncHnadler(async(req,res,next)=>{
   try {
    const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
    if(!token){
     throw new ApiError(401,"Unauthorized request")
    }
    const decoded=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
    const user =await User.findById(decoded?._id).select("-password -refreshToken")
    if(!user){
     throw new ApiError(400,"Invalid Access Token")
 
    }
    req.user=user;
    next()
 
   } catch (error) {
    throw new ApiError(401,error?.message || "invalid access token")
   }
})