


    import {v2 as cloudinary} from "cloudinary"
    import fs from "fs"
import { ApiError } from "./ApiError.js";
    
    
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
    const uploadfileoncloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null
            //upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            // file has been uploaded successfull
            console.log("file is uploaded on cloudinary ", response.url);
            fs.unlinkSync(localFilePath)
            return response;
    
        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
            return null;
        }
    }

    const removefromCloudinary=async(url)=>{
        const extractPublicId = (url) => {
            const regex = /\/(?:image|video)\/upload(?:\/v\d+)?\/([^\/\.]+)/;
            const match = url.match(regex);
            return match ? match[1] : null;
        };
      try {
         const  publicid=extractPublicId(url)
         await cloudinary.uploader.destroy(publicid)
      } catch (error) {
        throw ApiError(500,{},"Error in deleting the cloudeinary file")
      }
    }
    
    
    
    export {uploadfileoncloudinary,removefromCloudinary}