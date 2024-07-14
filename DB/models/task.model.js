import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Text", "List"],
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.type === "Text";
      },
    },
    items: {
      type: [String],
      required: function () {
        return this.type === "List";
      },
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const taskModel = model("Task", taskSchema);
