import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { APPOINTMENT_STATUS } from '../constants/index.js';

// ---- Book Appointment (User) ----
export const bookAppointment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { doctorId, slotDate, slotTime, paymentMethod, notes } = req.body;

  // 1. Check if doctor exists and is available
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new AppError('Doctor not found.', 404));
  }

  if (!doctor.available) {
    return next(new AppError('This doctor is currently not available for appointments.', 400));
  }

  // 2. Parse the date
  const appointmentDate = new Date(slotDate);
  appointmentDate.setHours(0, 0, 0, 0);

  // 3. Check for existing active appointment at the same slot
  const existingAppointment = await Appointment.findOne({
    doctorId,
    slotDate: appointmentDate,
    slotTime,
    status: { $nin: [APPOINTMENT_STATUS.CANCELLED] },
  });

  if (existingAppointment) {
    return next(new AppError('This time slot is already booked. Please choose a different slot.', 409));
  }

  // 4. Check if user already has an appointment with this doctor on the same date/time
  const userConflict = await Appointment.findOne({
    userId,
    slotDate: appointmentDate,
    slotTime,
    status: { $nin: [APPOINTMENT_STATUS.CANCELLED] },
  });

  if (userConflict) {
    return next(new AppError('You already have an appointment at this time.', 409));
  }

  // 5. Create appointment
  const appointment = await Appointment.create({
    userId,
    doctorId,
    slotDate: appointmentDate,
    slotTime,
    amount: doctor.fees,
    paymentMethod: paymentMethod || 'cash',
    notes: notes || '',
    status: APPOINTMENT_STATUS.PENDING,
  });

  // 6. Populate doctor info for response
  await appointment.populate('doctorId', 'name specialization image fees');
  await appointment.populate('userId', 'name email');

  sendSuccess(res, 201, { appointment }, 'Appointment booked successfully');
});

// ---- Get User's Appointments ----
export const getUserAppointments = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { status, page = 1, limit = 20 } = req.query;

  const query = { userId };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('doctorId', 'name specialization image fees address')
      .sort({ slotDate: -1, slotTime: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Appointment.countDocuments(query),
  ]);

  sendSuccess(res, 200, {
    appointments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ---- Cancel Appointment (User) ----
export const cancelAppointment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new AppError('Appointment not found.', 404));
  }

  // Verify ownership
  if (appointment.userId.toString() !== userId.toString()) {
    return next(new AppError('You can only cancel your own appointments.', 403));
  }

  // Can't cancel already completed or cancelled appointments
  if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    return next(new AppError('Cannot cancel a completed appointment.', 400));
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    return next(new AppError('This appointment is already cancelled.', 400));
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  await appointment.save();

  sendSuccess(res, 200, { appointment }, 'Appointment cancelled successfully');
});

// ---- Get Doctor's Appointments ----
export const getDoctorAppointments = catchAsync(async (req, res) => {
  const doctorId = req.user.id;
  const { status, page = 1, limit = 20 } = req.query;

  const query = { doctorId };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('userId', 'name email phone image')
      .sort({ slotDate: -1, slotTime: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Appointment.countDocuments(query),
  ]);

  sendSuccess(res, 200, {
    appointments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ---- Complete Appointment (Doctor) ----
export const completeAppointment = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new AppError('Appointment not found.', 404));
  }

  if (appointment.doctorId.toString() !== doctorId.toString()) {
    return next(new AppError('You can only complete your own appointments.', 403));
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    return next(new AppError('Cannot complete a cancelled appointment.', 400));
  }

  if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    return next(new AppError('This appointment is already completed.', 400));
  }

  appointment.status = APPOINTMENT_STATUS.COMPLETED;
  appointment.paymentStatus = 'completed';
  await appointment.save();

  sendSuccess(res, 200, { appointment }, 'Appointment marked as completed');
});

// ---- Cancel Appointment (Doctor) ----
export const doctorCancelAppointment = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new AppError('Appointment not found.', 404));
  }

  if (appointment.doctorId.toString() !== doctorId.toString()) {
    return next(new AppError('You can only cancel your own appointments.', 403));
  }

  if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    return next(new AppError('Cannot cancel a completed appointment.', 400));
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    return next(new AppError('This appointment is already cancelled.', 400));
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  await appointment.save();

  sendSuccess(res, 200, { appointment }, 'Appointment cancelled successfully');
});
