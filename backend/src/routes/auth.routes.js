import { Router } from 'express';
import { registerUser, loginUser, loginDoctor, loginAdmin } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = Router();

// User auth
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Doctor auth
router.post('/doctor/login', validateLogin, loginDoctor);

// Admin auth
router.post('/admin/login', validateLogin, loginAdmin);

export default router;
