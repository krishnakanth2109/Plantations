import dotenv from "dotenv";
import { Router } from "express";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { firebaseAdmin } from "../config/firebase.js";
import Booking from "../models/Booking.js";
import MaintenancePlan from "../models/MaintenancePlan.js";
import Payment from "../models/Payment.js";
import PlantLibraryArticle from "../models/PlantLibraryArticle.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import Subscription from "../models/Subscription.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import WishlistItem from "../models/WishlistItem.js";

dotenv.config();

const router = Router();

const seedUsers = {
  admin: {
    email: "yoginiplanters@gmail.com",
    password: "Yogini@2026#plants",
  },
  customer: {
    email: "customer@yogini.com",
    password: "customer123",
  },
};

export async function seedDatabase({ log = false } = {}) {
  if (log) console.log("Starting Yogini Planters database seed...");

  await verifyFirebaseCredentials();
  if (log) console.log("Firebase credentials verified.");

  const deleted = await Promise.all([
    Booking.deleteMany({}),
    Payment.deleteMany({}),
    Service.deleteMany({}),
    MaintenancePlan.deleteMany({}),
    PlantLibraryArticle.deleteMany({}),
    Review.deleteMany({}),
    WishlistItem.deleteMany({}),
    Subscription.deleteMany({}),
    Ticket.deleteMany({}),
    User.deleteMany({ email: { $in: [seedUsers.admin.email, seedUsers.customer.email] } }),
  ]);

  if (log) {
    console.log("Cleared old seed data:");
    console.log(`- Bookings: ${deleted[0].deletedCount}`);
    console.log(`- Payments: ${deleted[1].deletedCount}`);
    console.log(`- Services: ${deleted[2].deletedCount}`);
    console.log(`- Maintenance plans: ${deleted[3].deletedCount}`);
    console.log(`- Library articles: ${deleted[4].deletedCount}`);
    console.log(`- Reviews: ${deleted[5].deletedCount}`);
    console.log(`- Wishlist items: ${deleted[6].deletedCount}`);
    console.log(`- Subscriptions: ${deleted[7].deletedCount}`);
    console.log(`- Tickets: ${deleted[8].deletedCount}`);
    console.log(`- Seed users: ${deleted[9].deletedCount}`);
  }

  const firebaseAdminUser = await upsertFirebaseUser({
    email: seedUsers.admin.email,
    password: seedUsers.admin.password,
    displayName: "Sphoorthi (Admin)",
  });

  const firebaseCustomerUser = await upsertFirebaseUser({
    email: seedUsers.customer.email,
    password: seedUsers.customer.password,
    displayName: "Aarav Sharma",
  });

  const admin = await User.create({
    firebaseUid: firebaseAdminUser.uid,
    name: "Sphoorthi (Admin)",
    email: seedUsers.admin.email,
    phone: "+91 88974 84114",
    address: "Hyderabad, India",
    role: "admin",
    tag: "VIP",
    joinedAt: new Date("2025-08-01"),
  });

  const customer = await User.create({
    firebaseUid: firebaseCustomerUser.uid,
    name: "Aarav Sharma",
    email: seedUsers.customer.email,
    phone: "+91 98765 43210",
    address: "Banjara Hills, Hyderabad",
    role: "customer",
    tag: "Homeowner",
    joinedAt: new Date("2025-08-12"),
  });

  const [services, maintenancePlans, libraryArticles] = await Promise.all([
    Service.create([
      {
        title: "Indoor Plant Styling",
        slug: "indoor-plant-styling",
        category: "Styling",
        description: "Elegant styling planned for light, AC, furniture and lifestyle.",
        features: ["Light mapping", "Plant placement", "Decor styling"],
        priceNote: "Charges vary by space and plant selection.",
        sortOrder: 1,
      },
      {
        title: "Balcony Makeover",
        slug: "balcony-makeover",
        category: "Styling",
        description: "Peaceful, pollution-resistant green balcony spaces.",
        features: ["Layout planning", "Plant selection", "Balcony styling"],
        priceNote: "Charges vary by balcony size and plant count.",
        sortOrder: 2,
      },
      {
        title: "Landscaping",
        slug: "landscaping",
        category: "Landscaping",
        description: "Garden design, planting and outdoor styling.",
        features: ["Outdoor design", "Planting", "Landscape styling"],
        priceNote: "Quoted after site assessment.",
        sortOrder: 3,
      },
      {
        title: "Plant Wellness",
        slug: "plant-wellness",
        category: "Wellness",
        description: "Diagnosis, treatment and recovery for unhealthy plants.",
        features: ["Diagnosis", "Treatment plan", "Recovery tracking"],
        priceNote: "Charges depend on condition and treatment.",
        sortOrder: 4,
      },
      {
        title: "Fertilizing",
        slug: "fertilizing",
        category: "Fertilizing",
        description: "Organic nutrient planning and seasonal soil enrichment.",
        features: ["Nutrient plan", "Soil enrichment", "Seasonal feed"],
        priceNote: "Charges depend on plant count.",
        sortOrder: 5,
      },
    ]),
    MaintenancePlan.create([
      {
        name: "Partial",
        slug: "partial",
        description: "Guided plant care support with checklists, monitoring, and online help.",
        features: ["Plant health observation", "Watering guidance", "Online support"],
        priceNote: "Charges vary by number of plants and monitoring frequency.",
        sortOrder: 1,
      },
      {
        name: "Fully Customized",
        slug: "fully-customized",
        description: "Hands-off scheduled plant care managed by the Yogini Planters team.",
        features: ["Scheduled watering", "Fertilizing", "Pruning", "Repotting support"],
        priceNote: "Charges depend on plant count, space size, and frequency.",
        sortOrder: 2,
      },
    ]),
    PlantLibraryArticle.create([
      {
        title: "Watering basics",
        slug: "watering-basics",
        summary: "Learn when and how to water indoor plants.",
        content: "Most indoor plants prefer to dry out between waterings. Check the top inch of soil and water only when it feels dry.",
        category: "Care",
        tags: ["watering", "indoor plants"],
        sortOrder: 1,
      },
      {
        title: "Light requirements",
        slug: "light-requirements",
        summary: "Match your plants with the right light.",
        content: "Bright indirect light suits most tropical plants. Snake plants and ZZ plants tolerate lower-light corners.",
        category: "Care",
        tags: ["light", "placement"],
        sortOrder: 2,
      },
      {
        title: "Yellow leaves",
        slug: "yellow-leaves",
        summary: "Common causes and first steps for yellowing leaves.",
        content: "Yellow leaves usually point to overwatering or drainage issues. Let the soil dry, check drainage, and reduce frequency.",
        category: "Wellness",
        tags: ["diagnosis", "overwatering"],
        sortOrder: 3,
      },
    ]),
  ]);

  const indoorService = services.find((service) => service.slug === "indoor-plant-styling");
  const wellnessService = services.find((service) => service.slug === "plant-wellness");
  const partialPlan = maintenancePlans.find((plan) => plan.slug === "partial");

  const [bookings, subscription, ticket, payment, reviews, wishlistItems] = await Promise.all([
    Booking.create([
      {
        customerId: customer._id,
        serviceId: indoorService?._id,
        serviceType: "Indoor Plant Styling",
        date: new Date("2026-05-26"),
        address: "Banjara Hills",
        status: "Approved",
        amount: 8500,
        notes: "2BHK apartment, north-facing balcony",
      },
      {
        customerId: customer._id,
        serviceId: wellnessService?._id,
        serviceType: "Plant Wellness",
        date: new Date("2026-05-20"),
        address: "Gachibowli",
        status: "Completed",
        amount: 2000,
        notes: "Yellow leaves on money plant",
      },
    ]),
    Subscription.create({
      customerId: customer._id,
      planId: partialPlan?._id,
      plan: "Partial",
      plantsCount: 8,
      startDate: new Date("2026-03-01"),
      renewalDate: new Date("2026-06-01"),
      status: "Active",
    }),
    Ticket.create({
      customerId: customer._id,
      issue: "Money plant leaves turning yellow",
      diagnosis: "Overwatering; reduce frequency and repot in fresh soil.",
      status: "Diagnosed",
      createdAt: new Date("2026-05-19"),
    }),
    Payment.create({
      customerId: customer._id,
      amount: 8500,
      date: new Date("2026-05-15"),
      method: "UPI",
      status: "Paid",
      invoiceNumber: "INV-1001",
    }),
    Review.create([
      {
        customerId: customer._id,
        name: customer.name,
        rating: 5,
        text: "The maintenance support is professional and very helpful.",
        approved: true,
        approvedAt: new Date(),
      },
    ]),
    WishlistItem.create([
      {
        customerId: customer._id,
        serviceId: wellnessService?._id,
        serviceTitle: wellnessService?.title || "Plant Wellness",
      },
    ]),
  ]);

  const result = {
    message: "Seed data created",
    counts: {
      users: 2,
      bookings: bookings.length,
      subscriptions: subscription ? 1 : 0,
      tickets: ticket ? 1 : 0,
      payments: payment ? 1 : 0,
      services: services.length,
      maintenancePlans: maintenancePlans.length,
      libraryArticles: libraryArticles.length,
      reviews: reviews.length,
      wishlistItems: wishlistItems.length,
    },
    users: seedUsers,
  };

  if (log) {
    console.log("Created seed data:");
    console.log(`- Users: ${result.counts.users}`);
    console.log(`- Bookings: ${result.counts.bookings}`);
    console.log(`- Subscriptions: ${result.counts.subscriptions}`);
    console.log(`- Tickets: ${result.counts.tickets}`);
    console.log(`- Payments: ${result.counts.payments}`);
    console.log(`- Services: ${result.counts.services}`);
    console.log(`- Maintenance plans: ${result.counts.maintenancePlans}`);
    console.log(`- Library articles: ${result.counts.libraryArticles}`);
    console.log(`- Reviews: ${result.counts.reviews}`);
    console.log(`- Wishlist items: ${result.counts.wishlistItems}`);
    console.log("Login credentials:");
    console.log(`- Admin: ${seedUsers.admin.email} / ${seedUsers.admin.password}`);
    console.log(`- Customer: ${seedUsers.customer.email} / ${seedUsers.customer.password}`);
    console.log("Seed completed successfully.");
  }

  return result;
}

router.post("/", async (_req, res, next) => {
  try {
    const result = await seedDatabase({ log: true });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  try {
    await connectDB();
    await seedDatabase({ log: true });
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

export default router;

async function verifyFirebaseCredentials() {
  try {
    await firebaseAdmin.auth().listUsers(1);
  } catch (error) {
    const hint = [
      "Firebase Auth is not ready for this project.",
      "Open Firebase Console > Authentication and click Get started.",
      "Then enable the Email/Password sign-in provider.",
      "If Authentication is already enabled, confirm FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY all belong to the same Firebase project.",
      `Original Firebase error: ${error.message}`,
    ].join(" ");

    const wrapped = new Error(hint);
    wrapped.cause = error;
    throw wrapped;
  }
}

async function upsertFirebaseUser({ email, password, displayName }) {
  try {
    return await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName,
    });
  } catch (error) {
    if (error.code !== "auth/email-already-exists") {
      throw error;
    }

    const user = await firebaseAdmin.auth().getUserByEmail(email);
    return firebaseAdmin.auth().updateUser(user.uid, {
      password,
      displayName,
    });
  }
}
