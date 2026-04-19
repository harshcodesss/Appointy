import { useState, useEffect, useCallback } from 'react';
import { appointmentAPI } from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { AppointmentSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';

const TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (activeTab) params.status = activeTab;
      const { data } = await appointmentAPI.getMy(params);
      if (data.success) setAppointments(data.appointments);
    } catch { /* handled */ }
    finally { setLoading(false); }
  }, [activeTab]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await appointmentAPI.cancel(cancelId);
      setAppointments(prev => prev.map(a => a._id === cancelId ? { ...a, status: 'cancelled' } : a));
      setCancelId(null);
    } catch { /* handled */ }
    finally { setCancelling(false); }
  };

  return (
    <div className="section-padding py-10 animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-2">My <span className="gradient-text">Appointments</span></h1>
      <p className="text-muted mb-8">View and manage all your appointments.</p>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-200 rounded-xl mb-8 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? 'bg-white shadow-card text-dark' : 'text-muted hover:text-dark'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <AppointmentSkeleton key={i} />)}</div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          title="No appointments found"
          description="Book your first appointment with a trusted doctor."
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-50 overflow-hidden flex-shrink-0">
                {apt.doctorId?.image ? (
                  <img src={apt.doctorId.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-500 font-bold text-lg">
                    {apt.doctorId?.name?.charAt(0) || 'D'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark">{apt.doctorId?.name || 'Doctor'}</p>
                <p className="text-sm text-muted">{apt.doctorId?.specialization || apt.doctorId?.speciality}</p>
                <p className="text-sm text-muted mt-1">
                  📅 {new Date(apt.slotDate).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {apt.slotTime}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary-500">₹{apt.amount}</span>
                <StatusBadge status={apt.status} />
                {apt.status === 'pending' && (
                  <Button variant="danger" size="sm" onClick={() => setCancelId(apt._id)}>Cancel</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Appointment">
        <p className="text-muted text-sm mb-6">Are you sure you want to cancel this appointment? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setCancelId(null)}>Keep it</Button>
          <Button variant="danger" loading={cancelling} onClick={handleCancel}>Cancel Appointment</Button>
        </div>
      </Modal>
    </div>
  );
}
