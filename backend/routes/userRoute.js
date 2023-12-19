import { Router } from "express";
import { logOut, loginUser, userRegister } from "../Controllers/userController.js";
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

export default router;