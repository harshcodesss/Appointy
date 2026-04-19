import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Appoint<span className="text-primary-400">y</span></span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Making healthcare accessible. Book appointments with trusted doctors in minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/80">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Home', 'Doctors', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item === 'Home' ? '' : item.toLowerCase()}`} className="text-white/40 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white/80">Specializations</h4>
            <ul className="space-y-2.5">
              {['Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist'].map((item) => (
                <li key={item}>
                  <Link to={`/doctors?specialization=${item}`} className="text-white/40 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white/80">Contact</h4>
            <ul className="space-y-2.5 text-white/40 text-sm">
              <li>support@appointy.com</li>
              <li>+91 98765 43210</li>
              <li>Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2026 Appointy. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
