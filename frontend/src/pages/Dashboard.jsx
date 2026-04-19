import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { appointmentAPI } from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';

export default function Dashboard() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getMy({ status: 'pending', limit: 5 }).then(({ data }) => {
      if (data.success) setUpcoming(data.appointments);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-padding py-10 animate-fade-in">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold mb-2">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
        </h1>
        <p className="text-muted">Here's what's happening with your appointments.</p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/doctors', label: 'Book Appointment', icon: '📅', color: 'from-primary-500 to-primary-600' },
          { to: '/my-appointments', label: 'My Appointments', icon: '📋', color: 'from-secondary-400 to-secondary-500' },
          { to: '/profile', label: 'Edit Profile', icon: '👤', color: 'from-accent-400 to-accent-500' },
        ].map(({ to, label, icon, color }) => (
          <Link key={to} to={to}>
            <Card hover className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-xl shadow-lg`}>
                {icon}
              </div>
              <span className="font-semibold text-dark">{label}</span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Upcoming Appointments</h2>
          <Link to="/my-appointments"><Button variant="ghost" size="sm">View All</Button></Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
          </div>
        ) : upcoming.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-muted mb-4">No upcoming appointments</p>
            <Link to="/doctors"><Button size="sm">Book Now</Button></Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <Card key={apt._id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  {apt.doctorId?.image ? (
                    <img src={apt.doctorId.image} alt="" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <span className="text-primary-500 font-bold">{apt.doctorId?.name?.charAt(0) || 'D'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark truncate">{apt.doctorId?.name}</p>
                  <p className="text-sm text-muted">
                    {new Date(apt.slotDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} at {apt.slotTime}
                  </p>
                </div>
                <StatusBadge status={apt.status} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
