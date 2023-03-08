import mongoose from "mongoose";

const { Schema, model } = mongoose;

const dishSchema = new Schema(
  {
    name: { type: String, required: true },
    short_description: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://consumer-component-library.roocdn.com/26.13.16/static/images/placeholder.svg",
    },
    price: { type: Number, required: true },
    calories: { type: Number, required: true },
  },
  { timestamps: true }
);

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    short_description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    category: [{ type: String, required: true }],
    rating: { type: Number, max: 5, default: 1, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    dishes: [dishSchema],
  },
  { timestamps: true }
);

export default model("Restaurant", restaurantSchema);
