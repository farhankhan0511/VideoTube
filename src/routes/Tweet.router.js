import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { CreateTweet } from "../controllers/Tweet.controller.js";


const router=Router()

router.route("/CreateTweet").post(verifyJWT,CreateTweet)



export default router;