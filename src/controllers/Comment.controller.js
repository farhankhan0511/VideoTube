import { Comments } from "../models/Comments.model.js";
import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHnadler } from "../utils/asyncHandler.js";


const addComment=asyncHnadler(async(req,res)=>{
    const Owner=req.user 
    const {videoId}=req.params
    const {content}=req.body

    if(!content){
        throw new ApiError(400,"Error recomment")
    }
    if(!Owner){
        throw new ApiError(400,"Error recomment")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    

    const comment=await Comments.create({
        content:content,
        Owner:Owner,
        video:video
    })

    if(!comment){
        throw new ApiError(500,"Comment not added")
    }

    res.status(201).json(
        new ApiResponse(201,comment,"Comment Added Successfully")
    )
})

const DeleteComment=asyncHnadler(async(req,res)=>{

    const Owner=req.user
    const {videoId}=req.params
    const {commentid}=req.query

    if(!Owner){
        throw new ApiError(400,"Only loggined person can delete the comment")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    if(!commentid){
        throw new ApiError(400,"Comment not found")
    }

    await Comments.findByIdAndDelete(commentid)



    res.status(200).json(
        new ApiResponse(200,{},"Comment deleted successfully")
    )

})

const UpdateComment=asyncHnadler(async(req,res)=>{
    const {videoId}=req.params
    const {commentid}=req.query
    const user=req.user
    const {content}=req.body

    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    if (!content){
        throw new ApiError(400,"Cant update empty comment")
    }
    if(!commentid){
        throw new ApiError(400,"comment not found")
    }
    if(!user){
        throw new ApiError(400,"Only logged in user can edit the comment")
    }

    const comment=await Comments.findByIdAndUpdate(commentid,{
        $set:{content:content}
    },{new:true})

    if(!comment){
        throw new ApiError(500,"Error updating the comment")
    }
    res.status(201).json(
        new ApiResponse(200,comment,"Comment updated succeessfully")
    )

})

const getVideoComments=asyncHnadler(async(req,res)=>{

    const {videoId}=req.params
    const {page = 1, limit = 10} = req.query

    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }

    const videocomments=await Comments.aggregate([{
        $match:{
            video:video,
        }
    }])
    const options={
        page:page,
        limit:limit
    }

    const aggregatecomments=await Comments.aggregatePaginate(videocomments,options)

    if(!aggregatecomments){
        throw new ApiError(400,"Pagination failed")
    }

    res.status(200).json(
        new ApiResponse(200,aggregatecomments,"All comments genereated")
    )
    
    


})

export {addComment,DeleteComment,UpdateComment,getVideoComments}