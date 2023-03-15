import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["active", "paid", "delivered"],
      default: "active",
    },
    sharedOrder: { type: Boolean, default: false },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    dishes: [{ type: Schema.Types.ObjectId, ref: "Dish", required: true }],
    totalPrice: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
