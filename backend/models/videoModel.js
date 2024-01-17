import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoFile:{type:String,required:true},

    thumbnail:{type:String,required:true},  

    title:{type:String,required:true},

    description:{type:String,required:true},
   
    views:{type:Number,default:0},

    duration:{type:Number,required:true},
    
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"User"},

    isPublished:{type:Boolean,default:true},



},{timestamps:true});

const Video = mongoose.model("Video",videoSchema);
export default Video;