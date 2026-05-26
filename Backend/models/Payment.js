import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    method: { type: String, enum: ["UPI", "Razorpay", "Net Banking"], required: true },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
