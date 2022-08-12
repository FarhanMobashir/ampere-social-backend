import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    pinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pin",
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model("comment", commentSchema);
