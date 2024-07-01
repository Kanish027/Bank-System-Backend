import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: { type: String, enum: ["deposit", "withdraw"], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Account = new mongoose.model("Account", AccountSchema);

export default Account;
