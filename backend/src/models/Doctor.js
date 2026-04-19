import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { SPECIALIZATIONS } from '../constants/index.js';

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    image: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: {
        values: SPECIALIZATIONS,
        message: '{VALUE} is not a valid specialization',
      },
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    about: {
      type: String,
      required: [true, 'About section is required'],
      maxlength: [1000, 'About cannot exceed 1000 characters'],
    },
    fees: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// ---- Indexes ----
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ available: 1 });
doctorSchema.index({ name: 'text', specialization: 'text' });

// ---- Pre-save: hash password ----
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ---- Instance method: compare password ----
doctorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ---- Strip password from JSON ----
doctorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
