
import { Likes } from "../models/Likes.models.js";
import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comments } from "../models/Comments.model.js";
import { Tweets } from "../models/Tweets.models.js";

const toggleVideoLike=asyncHnadler(async(req,res)=>{
        const {videoId}=req.params
        const user=req.user
        
        const video=await Video.findById(videoId)
        if(!video){
           throw  new ApiError(400,"Incorrect URL")
        }
        if(!user){
            throw new ApiError(400,"Only logged in user can like")
        }
        let liked=await Likes.findOne({
            video:video,
            likedby:user})
        if(liked){
            await Likes.findOneAndDelete(liked._id)
            liked=null
        }
        else{
            const like=await Likes.create({
                video:video,
                likedby:user
            })
            if(!like){
                throw new ApiError(500,"Error while liking")
            }
            liked=like
        }

       
        res.status(200).json(
            new ApiResponse(200,liked,"Liked")
        )

})

const toggleTweetlike=asyncHnadler(async(req,res)=>{
    const user=req.user
    const {tweetid}=req.query

    if(!user){
        throw new ApiError(400,"must be logged in to like")
    }
  

    const tweet= await Tweets.findById(tweetid)
    if(!tweet){
        throw new ApiError(400,"tweet doesn't exist")
    }
    
   let liked= await Likes.findOne({likedby:user,
    Tweet:tweetid
   })
   if(liked){
        const like=await Likes.findOneAndDelete({likedby:user,
            Tweet:tweetid
           })
        liked=null
   }
   else{
     liked=await Likes.create({
        likedby:user,
        Tweet:tweet
    })
   } 
   res.status(201).json(
    new ApiResponse(201,liked,"Toggled successfully")
   )

})

const toggleCommentlike=asyncHnadler(async(req,res)=>{

const {videoId}=req.params
const{commentId}=req.query
const user=req.user

const video=await Video.findById(videoId)
if(!video){
   throw  new ApiError(400,"Incorrect URL")
}
if(!user){
    throw new ApiError(400,"Only logged in user can like")
}
if(!commentId){
    throw ApiError(400,"Comment doesnt exist")
}
    const comment=await Comments.findById(commentId)

let liked=await Likes.findOne({
    Comments:comment,
    likedby:user})
if(liked){
    await Likes.findOneAndDelete(liked._id)
    liked=null
}
else{
    const like=await Likes.create({
        Comments:comment,
        likedby:user
    })
    if(!like){
        throw new ApiError(500,"Error while liking")
    }
    liked=like
}


res.status(200).json(
    new ApiResponse(200,liked,"Liked")
)

}

)

export {toggleVideoLike,toggleCommentlike,toggleTweetlike}

