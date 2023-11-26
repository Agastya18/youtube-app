import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    avatar: { type: String, required: true},

     coverImage: { type: String, default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqPq4-8zLfy1e3_Y4GECe-U3MIkvx1AsGNgQ&usqp=CAU"},
    refreshToken: { type: String },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  },
  { timestamps: true }
);

// password hashing before saving
userSchema.pre("save", async function (next) {
 
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
})

// matching password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// generating token for user
userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })};

  // generating refresh token for user 
  userSchema.methods.getRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: process.env.JWT_EXPIRE_REFRESH,
    });
  };



 const User = mongoose.model("User", userSchema);
 export default User;
