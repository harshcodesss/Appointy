import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';

/**
 * Configures Cloudinary SDK. Only initializes if credentials are provided.
 */
const connectCloudinary = () => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️  Cloudinary credentials not configured — image uploads will fail');
    return;
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  console.log('✅ Cloudinary configured');
};

export default connectCloudinary;
