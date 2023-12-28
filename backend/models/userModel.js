import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim : true },

    email: { type: String, required: true, unique: true, trim : true },

    password: { type: String, required: true },

    avatar: { type: String, required: true},

     coverImage: { type: String, default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqPq4-8zLfy1e3_Y4GECe-U3MIkvx1AsGNgQ&usqp=CAU"},
    refreshToken: { type: String },
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  },
  { timestamps: true }
)

// password hashing before saving
userSchema.pre("save", async function (next) {
 
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
})

// for test


// matching password
userSchema.methods.isPasswordCorrect = async function(enterPassword){
  
  
  return await bcrypt.compare(enterPassword, this.password)
}

// generating token for user
userSchema.methods.getAccessToken = function () {
 
  return jwt.sign({ id: this._id  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
    
  })};

  // generating refresh token for user 
  userSchema.methods.getRefreshToken = function () {
    
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: process.env.JWT_EXPIRE_REFRESH,
    });
  };



  export const User = mongoose.model("User", userSchema)
