export default function Card({ children, className = '', glass = false, hover = false, ...props }) {
  return (
    <div
      className={`
        rounded-2xl p-6
        ${glass ? 'glass' : 'bg-white shadow-card'}
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
