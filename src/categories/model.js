import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    short_description: { type: String, required: true },
    image: { type: String, required: true },
    restaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
  },
  { timestamps: true }
);

export default model("Category", categorySchema);
