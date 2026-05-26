import { firebaseAdmin } from "../config/firebase.js";
import User from "../models/User.js";

function requireWebApiKey() {
  if (!process.env.FIREBASE_WEB_API_KEY) {
    throw new Error("FIREBASE_WEB_API_KEY is required for email/password login");
  }
  return process.env.FIREBASE_WEB_API_KEY;
}

async function signInWithPassword(email, password) {
  const apiKey = requireWebApiKey();
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    const firebaseCode = data.error?.message || "FIREBASE_LOGIN_FAILED";
    const loginMessages = {
      CONFIGURATION_NOT_FOUND:
        "Firebase Authentication is not enabled for this project. Open Firebase Console > Authentication, click Get started, and enable Email/Password sign-in.",
      EMAIL_NOT_FOUND:
        "No Firebase user exists for this email. Run the seed script after Firebase Authentication is enabled, or register this user first.",
      INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
      INVALID_PASSWORD: "Invalid email or password.",
      EMAIL_PASSWORD_SIGN_IN_DISABLED:
        "Email/Password sign-in is disabled in Firebase Authentication. Enable it in Firebase Console > Authentication > Sign-in method.",
      PASSWORD_LOGIN_DISABLED:
        "Email/Password sign-in is disabled in Firebase Authentication. Enable it in Firebase Console > Authentication > Sign-in method.",
      INVALID_API_KEY: "FIREBASE_WEB_API_KEY is invalid. Check Backend/.env against your Firebase web app config.",
    };

    const error = new Error(loginMessages[firebaseCode] || `Firebase login failed: ${firebaseCode}`);
    error.status = ["EMAIL_NOT_FOUND", "INVALID_LOGIN_CREDENTIALS", "INVALID_PASSWORD"].includes(firebaseCode)
      ? 401
      : 400;
    error.code = firebaseCode;
    throw error;
  }

  return data;
}

async function findOrCreateMongoUser(firebaseUser, defaults = {}) {
  const email = firebaseUser.email?.toLowerCase();
  if (!email) {
    const error = new Error("Firebase user email is required");
    error.status = 400;
    throw error;
  }

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        firebaseUid: firebaseUser.uid,
        name: defaults.name || firebaseUser.displayName || email.split("@")[0],
        phone: defaults.phone ?? "",
        address: defaults.address ?? "",
      },
      $setOnInsert: {
        role: defaults.role || "customer",
        tag: defaults.tag || "Homeowner",
        joinedAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return user;
}

function sendAuth(res, user, firebaseSession, status = 200) {
  return res.status(status).json({
    token: firebaseSession.idToken,
    refreshToken: firebaseSession.refreshToken,
    expiresIn: firebaseSession.expiresIn,
    user: user.toAuthJSON(),
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, phone = "", address = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "An account already exists for this email" });
    }

    let firebaseUser;
    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: normalizedEmail,
        password,
        displayName: name,
      });
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        firebaseUser = await firebaseAdmin.auth().getUserByEmail(normalizedEmail);
      } else {
        throw error;
      }
    }

    const user = await User.create({
      firebaseUid: firebaseUser.uid,
      name,
      email: normalizedEmail,
      phone,
      address,
      role: "customer",
    });

    const firebaseSession = await signInWithPassword(normalizedEmail, password);
    return sendAuth(res, user, firebaseSession, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const firebaseSession = await signInWithPassword(normalizedEmail, password);
    const firebaseUser = await firebaseAdmin.auth().getUser(firebaseSession.localId);
    const user = await findOrCreateMongoUser(firebaseUser);

    return sendAuth(res, user, firebaseSession);
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: user.toAuthJSON() });
  } catch (error) {
    next(error);
  }
}
