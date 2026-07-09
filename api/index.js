import mongoose from "mongoose";
import app from "../server/src/app.js";

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set");
    }
    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      bufferCommands: false,
    });
  }

  const conn = await cached.promise;
  cached.conn = conn.connection;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    return res.status(500).json({ error: "Database connection failed" });
  }
  return app(req, res);
}
