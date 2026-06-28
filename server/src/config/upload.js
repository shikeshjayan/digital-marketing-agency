// Setup file upload using multer + sharp (handles image upload, resize, and compression)
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Tell multer where to save uploaded files and what name to give them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Configure multer with storage, file size limit, and allowed image types
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

// Middleware: compress and resize uploaded images using sharp
export const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const inputPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isPng = ext === ".png";

    // Replace original with compressed version
    const tempPath = inputPath + ".tmp";

    let pipeline = sharp(inputPath).resize({
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

    await pipeline.toFile(tempPath);

    // Replace original with compressed file
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);

    next();
  } catch (err) {
    next(err);
  }
};

export default upload;
