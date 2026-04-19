import { Router } from 'express';
import {
  addDoctor,
  updateDoctor,
  deleteDoctor,
  changeAvailability,
  getAllAppointments,
  adminCancelAppointment,
  getDashboard,
  getAllUsers,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateAddDoctor, validateMongoId } from '../middleware/validate.js';
import upload from '../middleware/upload.js';
import { ROLES } from '../constants/index.js';

const router = Router();

// All admin routes require admin authentication
router.use(authenticate, authorize(ROLES.ADMIN));

// Doctor management
router.post('/doctors', upload.single('image'), validateAddDoctor, addDoctor);
router.put('/doctors/:id', upload.single('image'), validateMongoId('id'), updateDoctor);
router.delete('/doctors/:id', validateMongoId('id'), deleteDoctor);
router.patch('/doctors/availability', changeAvailability);

// Appointment management
router.get('/appointments', getAllAppointments);
router.patch('/appointments/:id/cancel', validateMongoId('id'), adminCancelAppointment);

// Dashboard
router.get('/dashboard', getDashboard);

// User management
router.get('/users', getAllUsers);

export default router;
