import "dotenv/config";
import admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing from Backend/.env`);
  }
  return value;
}

export function getFirebaseAdmin() {
  if (admin.apps.length) {
    return admin;
  }
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: requiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requiredEnv("FIREBASE_PRIVATE_KEY")
        .trim()
        .replace(/^["']|["']$/g, "") // Strip surrounding single or double quotes
        .replace(/\\n/g, "\n"),
    }),
  });

  return admin;
}

export const firebaseAdmin = getFirebaseAdmin();
