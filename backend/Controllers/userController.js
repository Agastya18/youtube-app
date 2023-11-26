import User from "../models/userModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


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

export {userRegister}