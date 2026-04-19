import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { APPOINTMENT_STATUS } from '../constants/index.js';
import { v2 as cloudinary } from 'cloudinary';

// ---- Add Doctor ----
export const addDoctor = catchAsync(async (req, res, next) => {
  const { name, email, password, specialization, degree, experience, about, fees, address } = req.body;

  // Check for existing doctor with same email
  const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
  if (existingDoctor) {
    return next(new AppError('A doctor with this email already exists.', 409));
  }

  // Handle image upload
  let imageUrl = '';
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'appointy/doctors',
    });
    imageUrl = uploadResult.secure_url;
  }

  // Parse address if it comes as a string (multipart form data)
  let parsedAddress = address;
  if (typeof address === 'string') {
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      parsedAddress = {};
    }
  }

  const doctor = await Doctor.create({
    name,
    email,
    password,
    image: imageUrl,
    specialization,
    degree,
    experience: Number(experience) || 0,
    about,
    fees: Number(fees) || 0,
    address: parsedAddress || {},
  });

  sendSuccess(res, 201, { doctor }, 'Doctor added successfully');
});

// ---- Update Doctor ----
export const updateDoctor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Don't allow password updates through this route
  const { password, ...updateData } = req.body;

  // Handle address parsing
  if (updateData.address && typeof updateData.address === 'string') {
    try {
      updateData.address = JSON.parse(updateData.address);
    } catch {
      delete updateData.address;
    }
  }

  // Handle numeric fields
  if (updateData.experience !== undefined) {
    updateData.experience = Number(updateData.experience);
  }
  if (updateData.fees !== undefined) {
    updateData.fees = Number(updateData.fees);
  }

  // Handle image upload
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'appointy/doctors',
    });
    updateData.image = uploadResult.secure_url;
  }

  const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return next(new AppError('Doctor not found.', 404));
  }

  sendSuccess(res, 200, { doctor }, 'Doctor updated successfully');
});

// ---- Delete Doctor ----
export const deleteDoctor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await Doctor.findByIdAndDelete(id);

  if (!doctor) {
    return next(new AppError('Doctor not found.', 404));
  }

  // Cancel all future pending appointments for this doctor
  await Appointment.updateMany(
    { doctorId: id, status: APPOINTMENT_STATUS.PENDING },
    { status: APPOINTMENT_STATUS.CANCELLED }
  );

  sendSuccess(res, 200, {}, 'Doctor deleted successfully');
});

// ---- Toggle Doctor Availability ----
export const changeAvailability = catchAsync(async (req, res, next) => {
  const { doctorId } = req.body;

  if (!doctorId) {
    return next(new AppError('Doctor ID is required.', 400));
  }

  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    return next(new AppError('Doctor not found.', 404));
  }

  doctor.available = !doctor.available;
  await doctor.save();

  sendSuccess(res, 200, { doctor }, `Doctor is now ${doctor.available ? 'available' : 'unavailable'}`);
});

// ---- Get All Appointments (Admin) ----
export const getAllAppointments = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('userId', 'name email phone image')
      .populate('doctorId', 'name specialization image fees')
      .sort({ createdAt: -1 })
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

// ---- Admin Cancel Appointment ----
export const adminCancelAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new AppError('Appointment not found.', 404));
  }

  if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    return next(new AppError('Cannot cancel a completed appointment.', 400));
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    return next(new AppError('This appointment is already cancelled.', 400));
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  await appointment.save();

  sendSuccess(res, 200, { appointment }, 'Appointment cancelled by admin');
});

// ---- Admin Dashboard ----
export const getDashboard = catchAsync(async (_req, res) => {
  // Use countDocuments instead of fetching all records — much more efficient
  const [totalDoctors, totalUsers, totalAppointments, latestAppointments] = await Promise.all([
    Doctor.countDocuments(),
    User.countDocuments(),
    Appointment.countDocuments(),
    Appointment.find()
      .populate('userId', 'name email image')
      .populate('doctorId', 'name specialization image')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const stats = await Appointment.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCounts = {};
  stats.forEach((s) => {
    statusCounts[s._id] = s.count;
  });

  sendSuccess(res, 200, {
    dashboard: {
      totalDoctors,
      totalUsers,
      totalAppointments,
      statusCounts,
      latestAppointments,
    },
  });
});

// ---- Get All Users (Admin) ----
export const getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(),
  ]);

  sendSuccess(res, 200, {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});
