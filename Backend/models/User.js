import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    tag: { type: String, enum: ["VIP", "Repeat", "Commercial", "Homeowner"], default: "Homeowner" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

userSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    id: this._id.toString(),
    firebaseUid: this.firebaseUid,
    name: this.name,
    email: this.email,
    phone: this.phone,
    address: this.address,
    role: this.role,
    tag: this.tag,
    joinedAt: this.joinedAt,
  };
};

export default mongoose.model("User", userSchema);
