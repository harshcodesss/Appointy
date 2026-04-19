import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('user'); // user | admin
  const { login, loginAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'admin' ? await loginAdmin(email, password) : await login(email, password);
    if (result.success) {
      navigate(mode === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-radial from-primary-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-dark mb-2">Welcome back</h1>
          <p className="text-muted">Sign in to your Appointy account</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-surface-200 rounded-xl mb-8">
          {[{ key: 'user', label: 'Patient' }, { key: 'admin', label: 'Admin' }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === key ? 'bg-white shadow-card text-dark' : 'text-muted hover:text-dark'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-glass-lg p-8 border border-surface-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-accent-500 text-sm font-medium animate-scale-in">
                {error}
              </div>
            )}

            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {mode === 'user' && (
            <p className="text-center text-sm text-muted mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">Sign up</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
