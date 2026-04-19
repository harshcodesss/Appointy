import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';

const TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (tab) params.status = tab;
      const { data } = await adminAPI.getAppointments(params);
      if (data.success) setAppointments(data.appointments);
    } catch { /* handled */ }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async (id) => {
    try {
      await adminAPI.cancelAppointment(id);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
    } catch { /* handled */ }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Appointments</h1>
        <p className="text-muted text-sm">Manage all patient appointments.</p>
      </div>

      <div className="flex gap-1 p-1 bg-surface-200 rounded-xl w-fit">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white shadow-card text-dark' : 'text-muted hover:text-dark'}`}>{label}</button>
        ))}
      </div>

      <Card>
        {loading ? <TableSkeleton rows={6} cols={6} /> : appointments.length === 0 ? (
          <p className="text-muted text-center py-12">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-2 text-muted font-medium">Patient</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Doctor</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Date & Time</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Status</th>
                  <th className="text-right py-3 px-2 text-muted font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id} className="border-b border-surface-100 hover:bg-surface-100/50 transition-colors">
                    <td className="py-3 px-2 font-medium">{apt.userId?.name || 'N/A'}</td>
                    <td className="py-3 px-2 text-muted">{apt.doctorId?.name || 'N/A'}</td>
                    <td className="py-3 px-2 text-muted">{new Date(apt.slotDate).toLocaleDateString('en', { month:'short', day:'numeric' })} {apt.slotTime}</td>
                    <td className="py-3 px-2 font-medium">₹{apt.amount}</td>
                    <td className="py-3 px-2"><StatusBadge status={apt.status} /></td>
                    <td className="py-3 px-2 text-right">
                      {apt.status === 'pending' && (
                        <Button variant="danger" size="sm" onClick={() => handleCancel(apt._id)}>Cancel</Button>
                      )}
                    </td>
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
