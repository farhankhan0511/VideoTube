import { User } from "../models/User.model.js";
import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import { removefromCloudinary, uploadfileoncloudinary } from "../utils/FileUpload.js";


const UploadVideo=asyncHnadler(async(req,res)=>{

    const {title,description}=req.body

    const owner=req.user?._id
    if(!owner){
        
        throw new ApiError(400,"Only loggedin User can upload")
    }
    console.log("here")
    if([title,description].some((field)=>field?.trim()===0)){
        throw new ApiError(400,"Plase provide all the details")
    }
    console.log("here")
    const videoFilelocalpath=req.files?.video[0].path

    if(!videoFilelocalpath){
        throw new ApiError(401,"Give the video")

    }

    const thumbnaillocalpath=req.files?.thumbnail[0].path
    if(!thumbnaillocalpath){
        throw new ApiError(401,"Give the Thumbnail")

    }
    console.log("here")
    const video= await uploadfileoncloudinary(videoFilelocalpath)
    const thumbnail=await uploadfileoncloudinary(thumbnaillocalpath)


    if(!video.url){
        throw new ApiError(401,"Video file is missing")
    }
    console.log("here")
    if(!thumbnail.url){
        throw new ApiError(401,"Thumbnail is missing")
    }
    console.log("here")
    

    const videouploaded=await Video.create({
        Owner:owner,
        title:title,
        description:description,
        videoFile:video.url,
        thumbnail:thumbnail.url
        

    })
    console.log("here")
    res.status(200).json(
        new ApiResponse(200,videouploaded,"Video Uploaded Successfully")
    )


    

    





})

const DeleteVideo=asyncHnadler(async(req,res)=>{
    const {videoId}=req.query
    const video=await Video.findById(videoId)
    const cloudid=video.videoFile
    await removefromCloudinary(cloudid)
    await Video.findByIdAndDelete(videoId)
    return res.status(200).json(
        new ApiResponse(200,{},"Video Deleted Successfullly")
    )
})

const TogglePublishStatus=asyncHnadler(async(req,res)=>{
    const {videoId}=req.query
    if(!videoId){
        throw new ApiError(400,"Invalid Video id")
    }
    console.log("here")
    const video = await Video.findById(videoId)
    console.log("here")
   
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    console.log("here")
    video.isPublished=!video.isPublished
    console.log("here")
    res.status(200).json(
        new ApiResponse(200,video,"published toggled")
    )
    }



)

const UpdateVideo=asyncHnadler(async(req,res)=>{

console.log(req.query)
console.log(req.body)
console.log(req.file?.path)

    const {videoId}=req.query
    const {title,description}=req.body
    const thumbnail=req.file?.path

   const video=await Video.findById(videoId)
   if(!video){
    throw new ApiError(400,"Video not found")
   }
    const cloudthumbnail=video?.thumbnail
        
    let newthumbnailurl=cloudthumbnail
    if(thumbnail){
        
        const newthumbnail=await uploadfileoncloudinary(thumbnail)
        if(!newthumbnail.url){
            throw new ApiError(500,"Error while uploading the image")
        }
        await removefromCloudinary(cloudthumbnail)
        newthumbnailurl=newthumbnail.url

    }
    const updatefields={}
    if(title){
        updatefields.title=title
    }
    if(description){
        updatefields.description=description
    }
    if(newthumbnailurl){
        updatefields.thumbnail=newthumbnailurl
    }

    await Video.findByIdAndUpdate(videoId,{
        $set:updatefields
    })
    const updatedvideo=await Video.findById(videoId)
    res.status(200).json(
        new ApiResponse(400,updatedvideo,"Updated video")
    )
    


})



export { UploadVideo,TogglePublishStatus,DeleteVideo,UpdateVideo}













