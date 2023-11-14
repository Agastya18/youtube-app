import mongoose from "mongoose";

const connectDB= async()=>{
 try {
   
    const conn=await mongoose.connect(process.env.MONGO_URL)
      console.log(`MongoDB Connected successfully: ${conn.connection.host}`);

      
 } catch (error) {
    
    console.log(`MONGODB connection FAILED : ${error}`);
    process.exit(1);
 }
}


export default connectDB
