import { useState } from 'react';

export default function Input({
  label, error, icon: Icon, type = 'text', className = '', ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-dark/80">
          {label}
        </label>
      )}
      <div className={`
        relative flex items-center rounded-xl border transition-all duration-200
        ${focused ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-surface-200'}
        ${error ? 'border-accent-500 ring-2 ring-accent-500/20' : ''}
        bg-white
      `}>
        {Icon && (
          <span className="pl-3.5 text-muted">
            <Icon size={18} />
          </span>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 bg-transparent text-dark placeholder-muted/60 text-sm
            outline-none rounded-xl
            ${Icon ? 'pl-2' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3.5 text-muted hover:text-dark transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-accent-500 text-xs font-medium">{error}</p>
      )}
    </div>
  );
}
