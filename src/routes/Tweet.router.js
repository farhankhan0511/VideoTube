import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { CreateTweet, DeleteTweet, getUserTweets, UpdateTweet } from "../controllers/Tweet.controller.js";


const router=Router()

router.route("/CreateTweet").post(verifyJWT,CreateTweet)

router.route("/DeleteTweet").delete(verifyJWT,DeleteTweet)
router.route("/UpdateTweet").patch(verifyJWT,UpdateTweet)
router.route("/getUserTweets").get(verifyJWT,getUserTweets)

export default router;