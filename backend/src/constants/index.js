/**
 * Application-wide constants.
 * Single source of truth for enums, roles, and valid values.
 */

export const ROLES = Object.freeze({
  USER: 'user',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
});

export const APPOINTMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
});

export const PAYMENT_METHODS = Object.freeze({
  CASH: 'cash',
  ONLINE: 'online',
});

export const SPECIALIZATIONS = Object.freeze([
  'General Physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Gastroenterologist',
  'Cardiologist',
  'Orthopedic',
  'ENT Specialist',
  'Urologist',
  'Psychiatrist',
  'Oncologist',
  'Ophthalmologist',
  'Dentist',
]);

/**
 * Valid appointment time slots (30-minute intervals from 8 AM to 8 PM).
 */
export const SLOT_TIMES = Object.freeze([
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00',
]);
