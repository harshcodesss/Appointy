const SPECIALIZATIONS = [
  'All', 'General Physician', 'Gynecologist', 'Dermatologist', 'Pediatrician',
  'Neurologist', 'Gastroenterologist', 'Cardiologist', 'Orthopedic',
  'ENT Specialist', 'Urologist', 'Psychiatrist', 'Oncologist', 'Ophthalmologist', 'Dentist',
];

export default function DoctorFilters({ search, onSearchChange, specialization, onSpecializationChange }) {
  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search doctors by name or specialty..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-surface-200 bg-white text-sm placeholder-muted/60 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
        />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {SPECIALIZATIONS.map((spec) => (
          <button
            key={spec}
            onClick={() => onSpecializationChange(spec === 'All' ? '' : spec)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              (spec === 'All' && !specialization) || specialization === spec
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white text-muted hover:text-dark hover:bg-surface-100 border border-surface-200'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>
    </div>
  );
}
