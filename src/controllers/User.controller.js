import { asyncHnadler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {uploadfileoncloudinary} from '../utils/FileUpload.js'
import {User} from "../models/User.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

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
        await User.findByIdAndDelete(req.user._id,{
            $set:{refreshToken:undefined

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


export {registerUser,loginUser,logoutuser,refreshAccessToken}
