import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const env = process.env.VERCEL_ENV; // development | preview | production

if (
  env === "production" &&
  process.env.MONGODB_URI?.includes("test")
) {
  throw new Error("❌ Production environment cannot use testing database");
}



let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Export as default
export default connectDB;
