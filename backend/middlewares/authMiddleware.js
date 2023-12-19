import jwt from "jsonwebtoken"
import {User} from "../models/userModel.js"

export const verifyJWT = async (req, res, next) => {
    try {
 const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: "You need to Login token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password -refreshToken");
        if(!user)
        {
            return res.status(401).json({ message: "User not found" });
        
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "You need to Login error" });
    }
}