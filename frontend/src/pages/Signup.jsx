import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-gradient-radial from-secondary-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-dark mb-2">Create account</h1>
          <p className="text-muted">Start booking appointments in minutes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-glass-lg p-8 border border-surface-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-accent-500 text-sm font-medium animate-scale-in">
                {error}
              </div>
            )}

            <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
