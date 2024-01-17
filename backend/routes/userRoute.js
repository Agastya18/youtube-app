import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChennalProfile, getWatchHistory, logOut, loginUser, refreshAccessToken, updateAccountDetails, updateUserAvatar, userRegister } from "../Controllers/userController.js";
import {upload} from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        
    ]),
    userRegister
    )
    router.route("/login").post(loginUser)
    router.route("/logout").post(verifyJWT,logOut)
    router.route("/refresh-token").post(refreshAccessToken)
    router.route("/change-password").post(verifyJWT,changeCurrentPassword)
    router.route("/current-user").get(verifyJWT,getCurrentUser)
    router.route("/update-account").patch(verifyJWT,updateAccountDetails)
    router.route("/avatar").patch( verifyJWT,upload.single("avatar"),updateUserAvatar)
    router.route("/c/:name").get(verifyJWT,getUserChennalProfile)
    router.route("/history").get(verifyJWT,getWatchHistory)
    
export default router;