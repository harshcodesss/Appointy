import { Router } from 'express';
import {
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  getDoctorAppointments,
  completeAppointment,
  doctorCancelAppointment,
} from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBookAppointment, validateMongoId } from '../middleware/validate.js';
import { ROLES } from '../constants/index.js';

const router = Router();

// All appointment routes require authentication
router.use(authenticate);

// ---- User routes ----
router.post('/', authorize(ROLES.USER), validateBookAppointment, bookAppointment);
router.get('/my', authorize(ROLES.USER), getUserAppointments);
router.patch('/:id/cancel', authorize(ROLES.USER), validateMongoId('id'), cancelAppointment);

// ---- Doctor routes ----
router.get('/doctor', authorize(ROLES.DOCTOR), getDoctorAppointments);
router.patch('/:id/complete', authorize(ROLES.DOCTOR), validateMongoId('id'), completeAppointment);
router.patch('/:id/doctor-cancel', authorize(ROLES.DOCTOR), validateMongoId('id'), doctorCancelAppointment);

export default router;
