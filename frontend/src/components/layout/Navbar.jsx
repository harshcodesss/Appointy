import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null; // Admin has its own sidebar

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/10">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-dark">Appoint<span className="text-primary-500">y</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to) ? 'text-primary-500 bg-primary-50' : 'text-muted hover:text-dark hover:bg-surface-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-dark">{user?.name?.split(' ')[0] || 'User'}</span>
                  <svg className={`w-4 h-4 text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-float border border-surface-200 py-2 animate-slide-down">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-muted hover:text-dark hover:bg-surface-100 transition-colors">
                        Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-muted hover:text-dark hover:bg-surface-100 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/my-appointments" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-muted hover:text-dark hover:bg-surface-100 transition-colors">
                      My Appointments
                    </Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-muted hover:text-dark hover:bg-surface-100 transition-colors">
                      Profile
                    </Link>
                    <hr className="my-2 border-surface-200" />
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}
                      className="w-full text-left px-4 py-2 text-sm text-accent-500 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                <Link to="/signup"><Button size="sm">Get Started</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface-100 text-muted">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-surface-200 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(to) ? 'text-primary-500 bg-primary-50' : 'text-muted hover:text-dark hover:bg-surface-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <hr className="my-2 border-surface-200" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-dark hover:bg-surface-100">Dashboard</Link>
                  <Link to="/my-appointments" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-dark hover:bg-surface-100">My Appointments</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-accent-500">Log out</button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
                  <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Sign up</Button></Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
