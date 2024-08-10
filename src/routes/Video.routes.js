import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer,middleware.js";
import { DeleteVideo, TogglePublishStatus, UpdateVideo, UploadVideo } from "../controllers/Video.conroller.js";

const router=Router()

router.route("/videoupload").post(verifyJWT,upload.fields([
    {
        name:"thumbnail",
        maxCount:1
    },
    {
        name:"video",
        maxCount:1
    }
]),UploadVideo)

router.route("/TogglePublishStatus").post(TogglePublishStatus)
router.route("/deletevideo").post(DeleteVideo)
router.route("/UpdateVideo").post(upload.single("thumbnail"),UpdateVideo)


export default router;