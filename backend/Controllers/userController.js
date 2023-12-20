import {User} from "../models/userModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

import jwt from "jsonwebtoken";
const userRegister = async(req,res)=>{
    // res.status(404).json({message:"Register route"});
    const {name,email,password} = req.body;
  
   if(!name || !email || !password){
       return res.status(400).json({message:"Please enter all fields"});
   }
    if(password.length < 6){
         return res.status(400).json({message:"Password should be atleast 6 characters"});
    }
    const existedUser = await User.findOne({email});
    if(existedUser){
        return res.status(400).json({message:"User already exists"});
    }
     console.log(req.files);
   const avatarLocal=  req.files?.avatar[0]?.path
   console.log(avatarLocal)
//    const  coverImageLocal = req.files?.coverImage[0]?.path
    if(!avatarLocal){
        return res.status(400).json({message:"Please upload avatar"});
    }
    const avatar= await uploadOnCloudinary(avatarLocal);
    console.log(avatar)
    // const coverImage = await uploadOnCloudinary(coverImageLocal);
    if(!avatar){
        return res.status(400).json({message:"Error uploading avatar"});
    }
    

    const user =await User.create({
        name,
        email,
        password,
        avatar: avatar.url,
        
        
    })
   
    if(user){
        return res.status(201).json({
            message:"User register-created successfully",
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            coverImage:user.coverImage,
            
            
        })
    }
    else{
        return res.status(400).json({message:"Invalid user data"});
    }
    



    

}
const loginUser = async(req, res) => {
   const {email, password} = req.body;
    if(!email || !password){
         return res.status(400).json({message:"Please enter all fields"});
    }
     let exUser = await User.findOne({email});
        if(!exUser){
            return res.status(400).json({message:"User does not exist"});
        }
        //  
          
       //console.log(exUser)

        const isMatch = await exUser.isPasswordCorrect(password);

         
          
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        const AccessToken = exUser.getAccessToken();
        if(!AccessToken){
            return res.status(400).json({message:"Invalid credentials"});
        }
         const refreshToken =exUser.getRefreshToken();
         if(!refreshToken){
            return res.status(400).json({message:"Invalid credentials"});
         }
         exUser.refreshToken = refreshToken;
         await exUser.save({validateBeforeSave:false});
         
         const option={
                httpOnly:true,
               

                
         }
            
            res.status(200).cookie('accessToken',AccessToken,option)
            res.cookie('refreshToken',refreshToken,option);
            const loggedInUser = {
                _id:exUser._id,
                name:exUser.name,
                email:exUser.email,
                avatar:exUser.avatar,
                coverImage:exUser.coverImage,
                refreshToken:exUser.refreshToken
            }
            if(loggedInUser){
                return res.status(200).json({
                    message:"User logged in successfully",
                    AccessToken,
                    refreshToken,
                    loggedInUser
                })
            }
            else{
                return res.status(400).json({message:"Invalid credentials"});
            }
          

        

}
const logOut = async(req,res)=>{
   const disp= await User.findByIdAndUpdate(req.user._id,{refreshToken:null},{new:true});
  // console.log(disp) 
   const option={
        httpOnly: true,
        
    }
    return res.status(200).clearCookie("accessToken",option).clearCookie("refreshToken",option).json({message:"User logged out successfully"});
}

const refreshAccessToken = async(req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken;
    if(!incomingRefreshToken){
        return res.status(400).json({message:"Please login again"});
    }
   try {
     const decoded = jwt.verify(incomingRefreshToken,process.env.JWT_SECRET_REFRESH);
     if(!decoded){
         return res.status(400).json({message:"Please login again"});
     }
     const useR = await User.findById(decoded.id);
     if(!useR){
         return res.status(400).json({message:"Please login again"});
     }
     
     if(useR.refreshToken !== incomingRefreshToken){
         return res.status(400).json({message:"Please login again"});
     }
     const newAccessToken = useR.getAccessToken();
     const newRefreshToken = useR.getRefreshToken();
     if(!newAccessToken){
         return res.status(400).json({message:"Please login again"});
     }
     if(!newRefreshToken){
            return res.status(400).json({message:"Please login again"});
     }
     const option ={
         httpOnly:true,
         
     }
     res.cookie("accessToken",newAccessToken,option);
     res.cookie("refreshToken",newRefreshToken,option);
     return res.status(200).json({message:"Access token refreshed successfully",newAccessToken,newRefreshToken});
   } catch (error) {
    console.log(error);
   }


}

const changeCurrentPassword = async(req, res) => {
    const {oldPassword,newPassword} = req.body;

    if(!oldPassword || !newPassword){
        return res.status(400).json({message:"Please enter all fields"});
    }
   const CurrentUser = await User.findById(req.user._id);
    if(!CurrentUser){
          return res.status(400).json({message:"User does not exist"});
    }
    const isValid = await CurrentUser.isPasswordCorrect(oldPassword);
    if(!isValid){
        return res.status(400).json({message:"Invalid old credentials"});
    }
    CurrentUser.password = newPassword;
    await CurrentUser.save({validateBeforeSave:false});
    return res.status(200).json({message:"Password changed successfully"});

}

const getCurrentUser = async(req,res)=>{
    const CurrentUser = await User.findById(req.user._id);
    if(!CurrentUser){
          return res.status(400).json({message:"User does not exist"});
    }
    return res.status(200).json({message:"User fetched successfully",CurrentUser});
}
export {userRegister,loginUser,logOut,refreshAccessToken,changeCurrentPassword}