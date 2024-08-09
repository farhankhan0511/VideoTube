import { asyncHnadler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {removefromCloudinary, uploadfileoncloudinary} from '../utils/FileUpload.js'
import {User} from "../models/User.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Subscription } from "../models/Subsription.model.js";
import mongoose from "mongoose";

const registerUser=asyncHnadler(async(req,res)=>{
    // res.status(200).json({
    //     message:"Hi"
    // })

    // data input field me lunga
    // get user details from frontend
    // models ke hisaab se data lunga
    // validations ex not empty
    // check if user already exists -email or username unique
    // check if the avatar and the cover exist or not 
    // upload images to cloudinary,avatar validate
    // extract string from cloudinaary
    // now i will create a user object-create entry in db
    // remove password and referesh token from response
    // check wether the response and user creation
    // return response

     
    const{fullname,username,password,email}= req.body

    console.log(req.body)
    
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

        if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")}
            console.log(req.files)
        const avatarloacalpath=req.files?.avatar[0]?.path;
        // const coverImagelocalpath= req.files?.coverImage[0]?.path;
        let  coverImagelocalpath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
            coverImagelocalpath=req.files.coverImage[0].path
        }

        if(!avatarloacalpath){
            throw new ApiError(400,"Avatar file is required")
        }

        const avatar=await uploadfileoncloudinary(avatarloacalpath)
        
        const coverImage=await uploadfileoncloudinary(coverImagelocalpath)
        if (!avatar){
            throw new ApiError(400,"Avatar file is required")

        }

         const user= await User.create({
            fullname,
            email,
            password,
            avatar:avatar.url,
            coverImage:"" || coverImage?.url,
            username:username.toLowerCase()
        })
        const createduser=await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if(!createduser){
            throw new ApiError(500,"Something went wrong while registering the user")
        }

        return res.status(201).json(
            new ApiResponse(200,createduser,"User Registered Successfully")
        )
 
})


const generateAccessandRefershToken= async(userId)=>{
try{
const user=await User.findById(userId)


const accessToken=user.generateAccessToken()

const refreshToken=user.generateRefershToken()

user.refreshToken=refreshToken
await user.save({validateBeforeSave:false})



return {accessToken,refreshToken}
}
catch(error){
    throw new ApiError(500,"Something went wrong while generating access and refersh token")
}
}


const loginUser=asyncHnadler(async(req,res)=>{
        //frontend se username or email and password 
        // find the user if not throw error
        //
        //assign access and refersh token
        //encrypt the password and match it with the one in db
        //check if the user has given teh details and not given any empty field
        //handle error
        //send cookier in which ther is the access and refersh token
        //give the respose


        const {email,username,password}=req.body

        if(!(username || email)){
            throw new ApiError(400,"Please enter the username or email")

        }

        const user=await User.findOne({$or:[{username},{email}]})

        if(!user){
            throw new ApiError("400","User not found")

        }
        

        const validpassword=await user.isPasswordCorrect(password)

        

        if(!validpassword){
            throw new ApiError(401,"invalid user credentials")
        }

        const {accessToken,refreshToken}=await generateAccessandRefershToken(user._id)

        const loggedinuser=await User.findOne(user._id).select("-password -refreshToken")

        
        const options={
            httpOnly:true,
            secure:true
        }

        
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,
                {
                    user:loggedinuser,accessToken,refreshToken
                },
                "USer logged In Successfully"
            )
        )




        

})


const logoutuser=asyncHnadler(
    async(req,res)=>{
        //clear the cookies
        //remove refershToken from db
        await User.findByIdAndUpdate(req.user._id,{
            $unset:{refreshToken:1

            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out"))

        
    }

)

const refreshAccessToken = asyncHnadler(async(req,res)=>{
    const incommingrefreshtoken=req.cookies.refreshToken || req.body.refreshToken

    if(!incommingrefreshtoken){
        throw new ApiError(401,"unathourized request")
    }
    try {
        const decodedToken=jwt.verify(incommingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"unathourized request")
        }
        if (incommingrefreshtoken!==user?.refreshToken){
            throw new ApiError(401,"Refresh token in expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newrefreshToken}=await generateAccessandRefershToken(user._id)
        return res.status(200).cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options).json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken:newrefreshToken
                },
                "Access token refreshed"
            )
        )
    
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})


const changeCurrentPassword=asyncHnadler(async(req,res)=>{

    const {oldPassword,newPassword}=req.body
    const user= await User.findById(req.user?._id)
    const isPassword=await user.isPasswordCorrect(oldPassword)

    if(!isPassword){
        throw new ApiError(400,"Invalid Password")

    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})


    return res.status(200).json(
        new ApiResponse(200,{},"Password Changed Successfully")
    )

})

const getcurrentUser=asyncHnadler(async(req,res)=>{
    
    return res.status(200).json(
        new ApiResponse(200,req.user,"Current user fetched successfully")
    )
    
})

const updateAccountdetails=asyncHnadler(async(req,res)=>{
    const {email,fullname}=req.body
    if(!email || !fullname){
        throw new ApiError(400,"Please provide email or fullname")
    }
    
    const user=await User.findByIdAndUpdate(req.user._id,{
        email:email,
        fullname:fullname
    },
{new:true}).select("-password")

    return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))

})

const updateUserAvatar=asyncHnadler(async(req,res)=>{
    const avatarloacalpath=req.file?.path
    if(!avatarloacalpath){
        throw new ApiError(400,"avatar file is missing")
    }
    const avatar=await uploadfileoncloudinary(avatarloacalpath)

    if(!avatar.url){
        throw new ApiError(500,"Error while uploading on avatar")
    }
    await removefromCloudinary(req.user.avatar)
    const user=await User.findByIdAndUpdate(req.user?._id,{
       $set:{
        avatar:avatar.url
       }
    },{
        new:true
    }).select("-password ")

    return res.status(200).json(
        new ApiResponse(200,user,"Avatar updated successfully")
    )
})

const updateUsercoverImage=asyncHnadler(async(req,res)=>{
    const coverImageloacalpath=req.file?.path
    if(!coverImageloacalpath){
        throw new ApiError(400,"CoverImage file is missing")
    }
    const coverImage=await uploadfileoncloudinary(coverImageloacalpath)

    

    if(!coverImage.url){
        throw new ApiError(500,"Error uploading on coverImage")
    }
    await removefromCloudinary(req.user.coverImage)
    const user=await User.findByIdAndUpdate(req.user?._id,{
       $set:{
        coverImage:coverImage.url
       }
    },{
        new:true
    }).select("-password")

    return res.status(200).json(
        new ApiResponse(200,user,"coverImage updated successfully")
    )
})

const getUserChannelprofile=asyncHnadler(async(req,res)=>{
    const {username}=req.params

    if(!username.trim()){
        throw new ApiError(400,"Channel not found")
    }

    const channel=await User.aggregate([{
        $match:{
            username:username?.toLowerCase()
        }
    },{
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },{
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"

        }
    },{
        $addFields:{
            subscriberscount: {
                $size: "$subscribers"
            },
            channelSubscribedTo: {
                $size: "$subscribedTo"
            },
            isSubscribed:{
                $cond:{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]
                    
                    },
                    then:true,
                    else:false
                }
            }
        }
    }
    ,{
        $project:{
            fullname:1,
            subscriberscount:1,
            isSubscribed:1,
            channelSubscribedTo:1,
            avatar:1,
            coverImage:1,
            username:1
            


            
        }
    }
])

if(!channel?.length){
    throw new ApiError(404,"Channel doesnot exist")
}

    return res.status(200).json(
        new ApiResponse(200,channel[0],"User profile fetched")
    )


})

const userWatchHistory=asyncHnadler(async(req,res)=>{

    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },{
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"user",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",

                            pipeline:[
                                {
                                    $project:{
                                    fullname:1,
                                    username:1,
                                    avatar:1,
                                }
                                }
                                ]
                        }
                    },
                    {
                     $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                     }   
                    }
                ]
            }
        }
    ])


    res.status(200).json(
        new ApiResponse(200,user[0].userWatchHistory,"user watch history fetched successfully")
    )




})




export {registerUser,loginUser,logoutuser,refreshAccessToken,getcurrentUser,changeCurrentPassword,updateAccountdetails,updateUserAvatar,updateUsercoverImage,getUserChannelprofile,userWatchHistory}
