import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

export default function DoctorCard({ doctor }) {
  const { _id, name, specialization, speciality, image, fees, experience, available } = doctor;
  const spec = specialization || speciality || 'General';

  return (
    <Link to={`/doctors/${_id}`}>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover-lift">
        {/* Image */}
        <div className="h-52 bg-primary-50 overflow-hidden relative">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-bold">
                {name?.charAt(0)}
              </div>
            </div>
          )}
          {/* Availability dot */}
          <div className="absolute top-3 right-3">
            <Badge variant={available ? 'success' : 'danger'}>
              {available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-semibold text-dark group-hover:text-primary-500 transition-colors text-lg">{name}</h3>
          <p className="text-sm text-muted mb-3">{spec}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted">
              {experience !== undefined && <span>{experience} yrs exp</span>}
            </div>
            {fees !== undefined && (
              <span className="text-sm font-bold text-primary-500">₹{fees}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
