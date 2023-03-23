import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const dailyFoodSchema = new Schema(
  {
    type: { type: String, enum: ["recipe", "order"], required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    calories: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    avatar: {
      type: String,
      default:
        "https://nvvpfaeffikon.ch/wp-content/uploads/sites/40/2021/04/default-user-icon.jpg",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["User", "Admin", "Owner"], default: "User" },
    googleId: { type: String, required: false },
    activeOrder: { type: Schema.Types.ObjectId, ref: "Order" },
    orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    sharedOrder: { type: Schema.Types.ObjectId, ref: "SharedOrder" },
    dailyFood: [dailyFoodSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 11);
    currentUser.password = hash;
  }
  next();
});

userSchema.methods.toJSON = function () {
  const userDocument = this;
  const user = userDocument.toObject();

  delete user.password;
  delete user.__v;
  return user;
};

userSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});
export default model("User", userSchema);
