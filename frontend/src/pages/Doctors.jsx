import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorAPI } from '../api/axios';
import DoctorCard from '../components/doctors/DoctorCard';
import DoctorFilters from '../components/doctors/DoctorFilters';
import { DoctorCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const search = searchParams.get('search') || '';
  const specialization = searchParams.get('specialization') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;

      const { data } = await doctorAPI.getAll(params);
      if (data.success) {
        setDoctors(data.doctors);
        setPagination(data.pagination);
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [search, specialization, page]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) { params.set(key, value); } else { params.delete(key); }
    if (key !== 'page') params.delete('page'); // Reset page on filter change
    setSearchParams(params);
  };

  return (
    <div className="section-padding py-10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Find Your <span className="gradient-text">Doctor</span></h1>
        <p className="text-muted">Browse our network of trusted healthcare professionals</p>
      </div>

      {/* Filters */}
      <DoctorFilters
        search={search}
        onSearchChange={(v) => updateParam('search', v)}
        specialization={specialization}
        onSpecializationChange={(v) => updateParam('specialization', v)}
      />

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-muted mt-6 mb-4">
          {pagination.total} doctor{pagination.total !== 1 && 's'} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          title="No doctors found"
          description="Try adjusting your search or removing filters."
          action={<Button variant="outline" size="sm" onClick={() => setSearchParams({})}>Clear Filters</Button>}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam('page', String(i + 1))}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    pagination.page === i + 1
                      ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                      : 'bg-white text-muted hover:bg-surface-100 border border-surface-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
