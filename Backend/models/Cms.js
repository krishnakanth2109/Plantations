import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "Bringing Nature Into Everyday Living" },
    heroSubtitle: { type: String, default: "Indoor plant styling, balcony makeovers, landscaping and wellness services." },
    aboutHeadline: { type: String, default: "Yogini — meaning the divine balance of nature" },
    aboutBody: { type: String, default: "At Yogini Planters, we believe plants are more than decoration — they bring peace, beauty, wellness, health and positive energy." },
    metaTitle: { type: String, default: "Yogini Planters — Indoor Plant Styling & Wellness, Hyderabad" },
    metaDescription: { type: String, default: "Elegant indoor plant styling, balcony makeovers, landscaping and plant wellness for modern homes, offices and cafés." },
    bannerActive: { type: Boolean, default: true },
    bannerText: { type: String, default: "Monsoon offer: 20% off all maintenance plans — use code GREEN20" }
  },
  { timestamps: true }
);

export default mongoose.model("Cms", cmsSchema);
