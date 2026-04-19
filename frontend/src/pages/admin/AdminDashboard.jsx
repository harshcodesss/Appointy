import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/axios';
import Card from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(({ data }) => {
      if (data.success) setDashboard(data.dashboard);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Doctors', value: dashboard?.totalDoctors || 0, icon: '🩺', color: 'from-primary-500 to-primary-600' },
    { label: 'Total Patients', value: dashboard?.totalUsers || 0, icon: '👥', color: 'from-secondary-400 to-secondary-500' },
    { label: 'Appointments', value: dashboard?.totalAppointments || 0, icon: '📅', color: 'from-amber-400 to-amber-500' },
    { label: 'Completed', value: dashboard?.statusCounts?.completed || 0, icon: '✅', color: 'from-green-400 to-green-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Dashboard</h1>
        <p className="text-muted text-sm">Overview of your appointment system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color }) => (
          <Card key={label} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">{label}</p>
                <p className="text-3xl font-extrabold text-dark">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-xl shadow-lg`}>
                {icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Latest Appointments */}
      <Card>
        <h2 className="text-lg font-bold mb-4">Latest Appointments</h2>
        {dashboard?.latestAppointments?.length === 0 ? (
          <p className="text-muted text-center py-8">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-2 text-muted font-medium">Patient</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Doctor</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.latestAppointments?.map((apt) => (
                  <tr key={apt._id} className="border-b border-surface-100 hover:bg-surface-100/50 transition-colors">
                    <td className="py-3 px-2 font-medium">{apt.userId?.name || 'N/A'}</td>
                    <td className="py-3 px-2 text-muted">{apt.doctorId?.name || 'N/A'}</td>
                    <td className="py-3 px-2 text-muted">{new Date(apt.slotDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} {apt.slotTime}</td>
                    <td className="py-3 px-2"><StatusBadge status={apt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
