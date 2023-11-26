import { Router } from "express";
import { userRegister } from "../Controllers/userController.js";
import {upload} from "../middlewares/multer.js";
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

export default router;