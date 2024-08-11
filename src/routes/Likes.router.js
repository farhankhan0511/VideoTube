import { Router } from "express";
import { toggleCommentlike, toggleTweetlike, toggleVideoLike } from "../controllers/Likes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router()

router.route("/:videoId/like").post(verifyJWT,toggleVideoLike)


router.route("/:videoId/comment/like").post(verifyJWT,toggleCommentlike)

router.route("/like").post(verifyJWT,toggleTweetlike)

export default router;