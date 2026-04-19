export function Skeleton({ className = '', ...props }) {
  return <div className={`skeleton ${className}`} {...props} />;
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <Skeleton className="h-48 w-full mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function AppointmentSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card flex gap-4">
      <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
