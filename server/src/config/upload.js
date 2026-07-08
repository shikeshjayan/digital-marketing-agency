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
async function processBuffer(buffer, originalname) {
  let pipeline = sharp(buffer).resize({
    width: 1200,
    height: 1200,
    fit: "inside",
    withoutEnlargement: true,
  });

  pipeline = pipeline.webp({ quality: 80 });

  const processedBuffer = await pipeline.toBuffer();
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;

  if (isProduction) {
    const { uploadToBlob } = await import("./blob.js");
    return await uploadToBlob(processedBuffer, filename, "image/webp");
  } else {
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, processedBuffer);
    return `/api/v1/uploads/${filename}`;
  }
}

export const processImage = async (req, res, next) => {
  try {
    // Handle upload.single() — file is on req.file (singular)
    if (req.file) {
      req.file.url = await processBuffer(req.file.buffer, req.file.originalname);
    }

    // Handle upload.fields() / upload.array() — files are on req.files (plural)
    if (req.files) {
      for (const [fieldname, fileArr] of Object.entries(req.files)) {
        for (const file of fileArr) {
          file.url = await processBuffer(file.buffer, file.originalname);
        }
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default upload;
