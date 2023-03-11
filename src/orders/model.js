import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "paid", "delivered"],
      default: "active",
    },
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
