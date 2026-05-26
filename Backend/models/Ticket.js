import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issue: { type: String, required: true, trim: true },
    photos: [{ type: String, trim: true }],
    diagnosis: { type: String, default: "" },
    status: { type: String, enum: ["Open", "Diagnosed", "Resolved"], default: "Open" },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Ticket", ticketSchema);
