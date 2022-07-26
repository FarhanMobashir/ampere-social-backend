import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    interests: {
      type: [{ type: String }],
      enum: [
        "Food",
        "Travel",
        "Entertainment",
        "Sports",
        "Music",
        "Art",
        "Fashion",
        "Lifestyle",
        "Health",
        "Science",
        "Technology",
      ],
      default: "Technology",
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "board",
      },
    ],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
};

export const User = mongoose.model("user", userSchema);
