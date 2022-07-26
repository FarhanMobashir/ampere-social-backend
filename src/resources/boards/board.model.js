import mongoose from "mongoose";
import { Pin } from "../pin/pin.model.js";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pin",
      },
    ],
    visibility: {
      type: String,
      enum: ["PRIVATE", "PUBLIC"],
      default: "PUBLIC",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const Board = mongoose.model("board", boardSchema);
