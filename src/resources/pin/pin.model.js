import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: {
      url: String,
      public_id: String,
    },
  },
  tags: [
    {
      type: String,
    },
  ],
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "board",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

// virtuals
pinSchema.virtual("pinCount").get(function () {
  return this.pins.length;
});

// hooks

export const Pin = mongoose.model("pin", pinSchema);
