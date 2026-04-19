import multer from 'multer';
import path from 'path';
import AppError from '../utils/AppError.js';

/**
 * Multer configuration for image uploads.
 * - Stores files in memory (for direct Cloudinary upload)
 * - Validates file type (images only)
 * - Limits file size to 5MB
 */

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (jpeg, jpg, png, webp, gif) are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
