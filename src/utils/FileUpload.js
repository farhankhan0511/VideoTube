import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

   
    const uploadfileoncloudinary=async(localfilepath)=>{
try{
    if(!localfilepath) return null
    
    cloudinary.uploader.upload(localfilepath,{
        resource_type:'auto'
    })
}
catch(error){
    fs.unlink(localfilepath)
    console.error(error)

}

    }