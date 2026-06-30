// Setup file upload using multer + sharp
// In production: uploads to Vercel Blob Storage
// In development: saves locally to server/uploads/
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

// Local uploads directory (for development only)
const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!isProduction && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Use memoryStorage so files stay in RAM (compatible with Vercel serverless)
const storage = multer.memoryStorage();

// Configure multer with storage, file size limit, and allowed image types
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

// Middleware: compress, resize, and upload image
export const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isPng = ext === ".png";

    let pipeline = sharp(req.file.buffer).resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    });

    if (isPng) {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
    } else {
      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
    }

    const processedBuffer = await pipeline.toBuffer();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    if (isProduction) {
      // Production: upload to Vercel Blob Storage
      const { uploadToBlob } = await import("./blob.js");
      const contentType = isPng ? "image/png" : "image/jpeg";
      const blobUrl = await uploadToBlob(processedBuffer, filename, contentType);
      req.file.url = blobUrl;
    } else {
      // Development: save locally
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, processedBuffer);
      // Store as relative path — served via /api/v1/uploads/
      req.file.url = `/api/v1/uploads/${filename}`;
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default upload;
