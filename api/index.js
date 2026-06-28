import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", "server", ".env") });

import mongoose from "mongoose";
import app from "../server/src/app.js";

let cached = null;

async function connectToDatabase() {
  if (cached && cached.readyState === 1) {
    return cached;
  }

  const conn = await mongoose.connect(process.env.MONGO_URL);
  cached = conn.connection;
  return cached;
}

const handler = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

export default handler;
