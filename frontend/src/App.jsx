import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import Dashboard from './pages/Dashboard';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminAddDoctor from './pages/admin/AdminAddDoctor';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminUsers from './pages/admin/AdminUsers';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="add-doctor" element={<AdminAddDoctor />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* Public + User routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected user routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
