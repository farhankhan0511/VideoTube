import { Router } from "express";
import { changeCurrentPassword, getcurrentUser, getUserChannelprofile, loginUser, logoutuser, refreshAccessToken, registerUser, updateAccountdetails, updateUserAvatar, updateUsercoverImage, userWatchHistory } from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer,middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes


router.route("/logout").post(verifyJWT,logoutuser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/getcurrentUser").get(verifyJWT,getcurrentUser)
router.route("/changepassword").post(verifyJWT,changeCurrentPassword)
router.route("/updateAccountdetails").patch(verifyJWT,updateAccountdetails)
router.route("/updateUserAvatar").patch(verifyJWT,
    upload.single("avatar")
    ,updateUserAvatar)
router.route("/updateUsercoverImage").patch(verifyJWT,upload.single("coverImage")
,updateUsercoverImage)


    router.route("/getUserChannelprofile/:username").get(verifyJWT,getUserChannelprofile)

router.route("/watchhistory").get(verifyJWT,userWatchHistory)

export default router;