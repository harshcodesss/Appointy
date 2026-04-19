import mongoose from 'mongoose';
import { APPOINTMENT_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/index.js';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    slotDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    slotTime: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
    },
    amount: {
      type: Number,
      required: [true, 'Appointment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.CASH,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ---- Indexes ----
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, slotDate: 1, slotTime: 1 });

/**
 * Compound unique index to prevent double booking.
 * Only active (non-cancelled) appointments should enforce uniqueness.
 * We use a partial filter to exclude cancelled appointments.
 */
appointmentSchema.index(
  { doctorId: 1, slotDate: 1, slotTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $nin: [APPOINTMENT_STATUS.CANCELLED] },
    },
    name: 'unique_active_slot',
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
