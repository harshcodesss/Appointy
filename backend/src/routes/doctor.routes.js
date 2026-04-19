import { Router } from 'express';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
} from '../controllers/doctor.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ROLES } from '../constants/index.js';

const router = Router();

// ---- Doctor-authenticated routes (must come before /:id) ----
router.get('/me/profile', authenticate, authorize(ROLES.DOCTOR), getDoctorProfile);
router.put('/me/profile', authenticate, authorize(ROLES.DOCTOR), updateDoctorProfile);

// ---- Public routes ----
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

export default router;
