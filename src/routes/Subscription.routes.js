import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedchannels, getUserChannelSubscribers, ToggleSubscription } from "../controllers/Subscription.controller.js";

const router=Router();


router.route("/:channelid").post(verifyJWT,ToggleSubscription)

router.route("/:channelid/subscribers").get(verifyJWT,getUserChannelSubscribers)

router.route("/").get(verifyJWT,getSubscribedchannels)

export default  router;




