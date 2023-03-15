import mongoose from "mongoose";

const { model, Schema } = mongoose;

const sharedOrderSchema = new Schema(
  {
    initiatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  },
  { timestamps: true }
);

export default model("SharedOrder", sharedOrderSchema);
