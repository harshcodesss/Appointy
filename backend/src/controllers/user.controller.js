import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { v2 as cloudinary } from 'cloudinary';

// ---- Get Profile ----
export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  sendSuccess(res, 200, { user });
});

// ---- Update Profile ----
export const updateProfile = catchAsync(async (req, res, next) => {
  // Only allow specific fields to be updated
  const allowedFields = ['name', 'phone', 'address', 'gender', 'dob'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      // Parse address if it comes as a JSON string (multipart form)
      if (field === 'address' && typeof req.body[field] === 'string') {
        try {
          updates[field] = JSON.parse(req.body[field]);
        } catch {
          return next(new AppError('Invalid address format.', 400));
        }
      } else {
        updates[field] = req.body[field];
      }
    }
  });

  // Handle image upload
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'appointy/users',
    });

    updates.image = uploadResult.secure_url;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  sendSuccess(res, 200, { user }, 'Profile updated successfully');
});
