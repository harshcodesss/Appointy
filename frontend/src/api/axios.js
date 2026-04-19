import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  loginDoctor: (data) => api.post('/auth/doctor/login', data),
  loginAdmin: (data) => api.post('/auth/admin/login', data),
};

// ---- Users ----
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ---- Doctors ----
export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getProfile: () => api.get('/doctors/me/profile'),
  updateProfile: (data) => api.put('/doctors/me/profile', data),
};

// ---- Appointments ----
export const appointmentAPI = {
  book: (data) => api.post('/appointments', data),
  getMy: (params) => api.get('/appointments/my', { params }),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  getDoctorAppointments: (params) => api.get('/appointments/doctor', { params }),
  complete: (id) => api.patch(`/appointments/${id}/complete`),
  doctorCancel: (id) => api.patch(`/appointments/${id}/doctor-cancel`),
};

// ---- Admin ----
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  addDoctor: (data) => api.post('/admin/doctors', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateDoctor: (id, data) => api.put(`/admin/doctors/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  changeAvailability: (doctorId) => api.patch('/admin/doctors/availability', { doctorId }),
  getAppointments: (params) => api.get('/admin/appointments', { params }),
  cancelAppointment: (id) => api.patch(`/admin/appointments/${id}/cancel`),
  getUsers: (params) => api.get('/admin/users', { params }),
};

export default api;
