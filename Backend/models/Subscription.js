import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "MaintenancePlan" },
    plan: { type: String, enum: ["Partial", "Fully Customized"], required: true },
    plantsCount: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    renewalDate: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Paused", "Cancelled"], default: "Active" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Subscription", subscriptionSchema);
