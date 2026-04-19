import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../api/axios';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

const SLOT_TIMES = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00',
];

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bookedSlots, setBookedSlots] = useState([]);

  const dates = getNext7Days();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await doctorAPI.getById(id);
        if (data.success) setDoctor(data.doctor);
      } catch {
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  // Fetch booked slots for selected date
  useEffect(() => {
    if (!selectedDate || !isAuthenticated) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    appointmentAPI.getMy({ status: 'pending' }).then(({ data }) => {
      if (data.success) {
        const slots = data.appointments
          .filter(a => a.doctorId?._id === id && a.slotDate?.startsWith(dateStr))
          .map(a => a.slotTime);
        setBookedSlots(slots);
      }
    }).catch(() => {});
  }, [selectedDate, id, isAuthenticated]);

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedDate || !selectedTime) { setMessage({ type: 'error', text: 'Please select a date and time slot.' }); return; }

    setBooking(true);
    setMessage({ type: '', text: '' });
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data } = await appointmentAPI.book({ doctorId: id, slotDate: dateStr, slotTime: selectedTime });
      if (data.success) {
        setMessage({ type: 'success', text: 'Appointment booked successfully!' });
        setSelectedTime('');
        setBookedSlots(prev => [...prev, selectedTime]);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding py-10 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  const spec = doctor.specialization || doctor.speciality || 'General';

  return (
    <div className="section-padding py-10 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-48 rounded-xl bg-primary-50 overflow-hidden flex-shrink-0">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-bold">
                    {doctor.name?.charAt(0)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-dark mb-1">{doctor.name}</h1>
                  <p className="text-muted">{doctor.degree}</p>
                </div>
                <Badge variant={doctor.available ? 'success' : 'danger'}>
                  {doctor.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Badge variant="primary">{spec}</Badge>
                {doctor.experience !== undefined && <Badge>{doctor.experience} yrs experience</Badge>}
              </div>
              <p className="text-sm text-muted mt-4 leading-relaxed">{doctor.about}</p>
              <p className="text-xl font-bold text-primary-500 mt-4">₹{doctor.fees} <span className="text-sm text-muted font-normal">per consultation</span></p>
            </div>
          </Card>
        </div>

        {/* Booking Panel */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <h2 className="text-lg font-bold mb-4">Book Appointment</h2>

            {!doctor.available ? (
              <p className="text-sm text-muted text-center py-8">This doctor is currently not available for appointments.</p>
            ) : (
              <>
                {/* Date picker */}
                <p className="text-sm font-medium text-muted mb-3">Select Date</p>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {dates.map((d) => {
                    const isSelected = selectedDate?.toDateString() === d.toDateString();
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => { setSelectedDate(d); setSelectedTime(''); }}
                        className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                            : 'bg-surface-100 text-muted hover:bg-primary-50 hover:text-primary-500'
                        }`}
                      >
                        <span className="font-medium">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
                        <span className="text-lg font-bold">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <>
                    <p className="text-sm font-medium text-muted mb-3">Select Time</p>
                    <div className="grid grid-cols-4 gap-2 mb-6 max-h-48 overflow-y-auto pr-1">
                      {SLOT_TIMES.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-lg text-xs font-medium transition-all ${
                              isBooked
                                ? 'bg-surface-200 text-muted/40 cursor-not-allowed line-through'
                                : isSelected
                                  ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                                  : 'bg-surface-100 text-muted hover:bg-primary-50 hover:text-primary-500'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {message.text && (
                  <div className={`p-3 rounded-xl text-sm font-medium mb-4 animate-scale-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-accent-500 border border-red-100'}`}>
                    {message.text}
                  </div>
                )}

                <Button onClick={handleBook} loading={booking} disabled={!selectedDate || !selectedTime} className="w-full" size="lg">
                  Book for ₹{doctor.fees}
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
