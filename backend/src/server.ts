import mongoose from "mongoose";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { seedDatabase } from "./seed/seed.js";

try {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected successfully");
  await seedDatabase();
  app.listen(env.PORT, () => console.log(`Noor API running on :${env.PORT}`));
} catch (err: any) {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  console.error("\nTroubleshooting tips:");
  console.error("1. In MongoDB Atlas: Go to Security -> Network Access -> Add IP Address -> Click 'Allow Access From Anywhere' (0.0.0.0/0).");
  console.error("2. Check that your username and password in MONGO_URI do not contain unencoded special characters or leftover '<' and '>'.\n");
  process.exit(1);
}

