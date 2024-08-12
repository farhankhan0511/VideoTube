import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/Dashboard.controller.js";


const router=Router()
router.route("/videos").get(verifyJWT,getChannelVideos)

router.route("/stats").get(verifyJWT,getChannelStats)

export default router