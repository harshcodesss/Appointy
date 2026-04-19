import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateUpdateProfile } from '../middleware/validate.js';
import upload from '../middleware/upload.js';
import { ROLES } from '../constants/index.js';

const router = Router();

// All routes require user authentication
router.use(authenticate, authorize(ROLES.USER));

router.get('/profile', getProfile);
router.put('/profile', upload.single('image'), validateUpdateProfile, updateProfile);

export default router;
