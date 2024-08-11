
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, DeleteComment, getVideoComments, UpdateComment } from "../controllers/Comment.controller.js";

const router=Router()

router.route("/:videoId/comment").post(verifyJWT,addComment)
router.route("/:videoId/comment").delete(verifyJWT,DeleteComment)
router.route("/:videoId/comment").patch(verifyJWT,UpdateComment)
router.route("/:videoId/comment").get(verifyJWT,getVideoComments)




export default router;
