import mongoose,{Schema} from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    avatar: { type: String, default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg" },

    coverImage: { type: String, default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg" },
    refreshToken: { type: String, required: true },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  },
  { timestamps: true }
);
 const User = mongoose.model("User", userSchema);
    export default User;
