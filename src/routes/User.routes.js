import { Router } from "express";
import { changeCurrentPassword, getcurrentUser, loginUser, logoutuser, refreshAccessToken, registerUser, updateAccountdetails, updateUserAvatar, updateUsercoverImage } from "../controllers/User.controller.js";
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
router.route("/updateAccountdetails").post(verifyJWT,updateAccountdetails)
router.route("/updateUserAvatar").post(verifyJWT,
    upload.single("avatar")
    ,updateUserAvatar)
router.route("/updateUsercoverImage").post(verifyJWT,upload.single("coverImage")
,updateUsercoverImage)


export default router;