export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {icon && (
        <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 text-primary-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-dark mb-2">{title}</h3>
      {description && (
        <p className="text-muted text-sm max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
