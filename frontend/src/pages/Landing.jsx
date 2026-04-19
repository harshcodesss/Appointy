import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useEffect, useState } from 'react';
import { doctorAPI } from '../api/axios';

const features = [
  { icon: '🔍', title: 'Find Your Doctor', desc: 'Browse specialists by category, read reviews, and choose the perfect doctor for your needs.' },
  { icon: '📅', title: 'Instant Booking', desc: 'Pick a convenient date and time slot. No calls, no waiting — book in under 60 seconds.' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'Get timely reminders before your appointments so you never miss a visit.' },
  { icon: '🛡️', title: 'Secure & Private', desc: 'Your health data is encrypted and protected with enterprise-grade security.' },
  { icon: '💳', title: 'Easy Payments', desc: 'Pay online or at the clinic. Multiple payment options for your convenience.' },
  { icon: '⭐', title: 'Verified Doctors', desc: 'All doctors are verified with their credentials and qualifications checked.' },
];

const steps = [
  { num: '01', title: 'Search', desc: 'Browse our network of trusted doctors and specialists.' },
  { num: '02', title: 'Book', desc: 'Choose your preferred date, time, and book instantly.' },
  { num: '03', title: 'Visit', desc: 'Show up for your appointment. It\'s that simple.' },
];

const stats = [
  { value: '500+', label: 'Verified Doctors' },
  { value: '50K+', label: 'Appointments' },
  { value: '10K+', label: 'Happy Patients' },
  { value: '15+', label: 'Specializations' },
];

export default function Landing() {
  const [topDoctors, setTopDoctors] = useState([]);

  useEffect(() => {
    doctorAPI.getAll({ limit: 4, available: true }).then(({ data }) => {
      if (data.success) setTopDoctors(data.doctors);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="section-padding pt-10 pb-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-primary-100/60 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-secondary-50/60 to-transparent rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100">
              <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse-soft" />
              <span className="text-sm font-medium text-primary-600">Trusted by 10,000+ patients</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Your Health,{' '}
              <span className="gradient-text">Our Priority</span>
            </h1>

            <p className="text-lg text-muted max-w-lg leading-relaxed">
              Book appointments with the best doctors in minutes. No queues, no hassle — just quality healthcare at your fingertips.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/doctors">
                <Button size="lg">
                  Find a Doctor
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8 pt-4">
              {stats.slice(0, 3).map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-dark">{value}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:flex justify-center animate-fade-in">
            <div className="relative">
              <div className="w-[420px] h-[420px] rounded-3xl gradient-bg-hero p-8 flex items-end justify-center overflow-hidden shadow-float">
                <div className="text-center text-white space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Quality Healthcare</h3>
                  <p className="text-white/70 text-sm">Access the best doctors anytime</p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-8 glass rounded-2xl p-4 shadow-float animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-500 flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <p className="text-sm font-semibold">Appointment Confirmed</p>
                    <p className="text-xs text-muted">Dr. Priya • 10:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-8 glass rounded-2xl p-4 shadow-float animate-float" style={{animationDelay: '2s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">500+ Doctors</p>
                    <p className="text-xs text-muted">Across 15 specialties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="section-padding py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white shadow-card">
              <p className="text-3xl font-extrabold gradient-text">{value}</p>
              <p className="text-sm text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section-padding py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Why Choose <span className="gradient-text">Appointy</span></h2>
          <p className="text-muted max-w-xl mx-auto">Everything you need for hassle-free healthcare, all in one platform.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <Card key={title} hover className="group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-dark">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-padding py-20 bg-white rounded-3xl my-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-muted max-w-xl mx-auto">Get started in three simple steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className="text-center relative">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg text-white flex items-center justify-center text-2xl font-extrabold mb-5 shadow-lg shadow-primary-500/25">
                {num}
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-muted text-sm">{desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Doctors ── */}
      {topDoctors.length > 0 && (
        <section className="section-padding py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">Top <span className="gradient-text">Doctors</span></h2>
              <p className="text-muted">Book with our highest-rated specialists.</p>
            </div>
            <Link to="/doctors"><Button variant="outline" size="sm">View All</Button></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDoctors.map((doc) => (
              <Link key={doc._id} to={`/doctors/${doc._id}`}>
                <Card hover className="group">
                  <div className="w-full h-48 rounded-xl bg-primary-50 mb-4 overflow-hidden flex items-center justify-center">
                    {doc.image ? (
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-bold">
                        {doc.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-secondary-500" />
                    <span className="text-xs text-secondary-500 font-medium">Available</span>
                  </div>
                  <h3 className="font-semibold text-dark group-hover:text-primary-500 transition-colors">{doc.name}</h3>
                  <p className="text-sm text-muted">{doc.specialization || doc.speciality}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="section-padding py-20">
        <div className="gradient-bg-hero rounded-3xl p-12 sm:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Take Control of Your Health?</h2>
            <p className="text-white/70 max-w-lg mx-auto mb-8">Join thousands of patients who trust Appointy for their healthcare needs.</p>
            <Link to="/signup">
              <Button variant="white" size="xl">
                Get Started Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
