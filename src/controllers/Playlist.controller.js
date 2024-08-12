

import { Playlist} from "../models/Playlist.model.js";
import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import { removefromCloudinary, uploadfileoncloudinary } from "../utils/FileUpload.js";


const CreatePlaylist=asyncHnadler(async(req,res)=>{

    const {name,description}=req.body
    const Owner=req.user

    if(!name || !description){
        throw new ApiError(400,"Please fill all the fields")
    }
    if(!Owner){
        throw new ApiError(400,"Login required to create a playlist")
    }

    const playlist=await Playlist.create({
        name:name,
        description:description,
        Owner:Owner
        
    })
    if(!playlist){
        throw new ApiError(500,"Something went wrong while creating the playlist")
    }
    res.status(200).json(
        new ApiResponse(201,playlist,"Playlist created Successfully")
    )



    


})

const AddVideosToPlaylist=asyncHnadler(async(req,res)=>{
        const {playlistid,videoid}=req.params
        
        const playlist=await Playlist.findById(playlistid)
        const video=await Video.findById(videoid)
        if(!playlist || !video){
            throw new ApiError(400,"Invalid action")
        }
        const playList=await Playlist.findByIdAndUpdate(playlistid,{
           
            $addToSet:
                {Videos:videoid}
        },{
                new:true,

            }
           
        )
        if(!playList){
            throw new ApiError(500,"Playlist not created")
        }
        res.status(201).json(
            new ApiResponse(201,playList,"Videos Added to Playlist successfully")
        )

})

const GetUserPlaylist=asyncHnadler(async(req,res)=>{
    const user=req.user
    if(!user){
        throw new ApiError(400,"Please login")
    }
    const userplaylist=await Playlist.find({Owner:user})
    if(!userplaylist){
        throw new ApiError(500,"Playlist fetch fail")
    }
    res.status(200).json(
        new ApiResponse(200,userplaylist,"User playlist fetched")
    )
    
})

const RemoveVideofromPlaylist=asyncHnadler(async(req,res)=>{
    const{playlistid}=req.params
    const {videoid}=req.query
    const playList=await Playlist.findById(playlistid)
    if(!playList){
        throw new ApiError(400,"Playlist doesnt exist")
    }
    const updatedplaylist=await Playlist.findByIdAndUpdate(
        playlistid,{
            $pull:{Videos:videoid}
        },{
            new:true
        }
    )
    if(!updatedplaylist){
        throw new ApiError(500,"Error while deleting")
    }
    res.status(200).json(
        new ApiResponse(200,updatedplaylist,"Video removed from playlist successfully")
    )

})

const DeletePlaylist=asyncHnadler(async(req,res)=>{
    const {playlistid}=req.params
    const playList=await Playlist.findById(playlistid)
    if(!playList){
        throw new ApiError(400,"Playlist doesn't exist")
    }
    await Playlist.findByIdAndDelete(playList)
    res.status(200).json(
        new ApiResponse(200,{},"Playlist deleted Successfully")
    )
})

const UpdatePlaylist=asyncHnadler(async(req,res)=>{
    const {name,description}=req.body
    const {playlistid}=req.params

    const playlist=await Playlist.findById(playlistid)
    if(!playlist){
        throw new ApiError("Invalid Url")
    }

    if(name.trim==="" && description.trim===""){
        throw new ApiError(400,"Fields are requried")
    }
    const updatedfields={}
    if(name){
        updatedfields.name=name
    }
    if(description){
        updatedfields.description=description
    }

    const updated=await Playlist.findByIdAndUpdate(playlistid,{$set:updatedfields},{new:true})
    if(!updated){
        throw new ApiError(500,"Error while updating")
    }

    res.status(200).json(
        new ApiResponse(200,updated,"Playlist updated successfully")
    )
})
export {CreatePlaylist,AddVideosToPlaylist,GetUserPlaylist,RemoveVideofromPlaylist,DeletePlaylist,UpdatePlaylist}


