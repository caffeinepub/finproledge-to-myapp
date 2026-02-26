import { ReactNode } from 'react';
import Navigation from './Navigation';
import { Link } from '@tanstack/react-router';
import { SiX, SiInstagram, SiLinkedin } from 'react-icons/si';
import { Heart } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'finproledge';
  const utmContent = encodeURIComponent(hostname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/generated/logo.dim_400x120.png"
                  alt="FinPro Ledge"
                  className="h-8 w-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-white font-bold text-xl">
                  FinPro <span className="text-gold">Ledge</span>
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                Delivering rigorous financial services with integrity and precision since 1994. Your dedicated extension of a finance department.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://x.com/FinproLedge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors duration-200"
                  aria-label="Twitter / X"
                >
                  <SiX className="w-5 h-5" />
                  <span className="text-sm">@finproledge</span>
                </a>
                <a
                  href="https://www.instagram.com/finproledge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <SiInstagram className="w-5 h-5" />
                  <span className="text-sm">@finproledge</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/finproledge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin className="w-5 h-5" />
                  <span className="text-sm">FinPro Ledge</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'About Us', to: '/about-us' },
                  { label: 'Contact Us', to: '/contact' },
                  { label: 'Service Booking', to: '/service-booking' },
                  { label: 'Client Portal', to: '/client-portal' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/60 hover:text-gold text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
              <ul className="space-y-2">
                {[
                  'Income Tax Filing',
                  'GST Filing',
                  'TDS Filing',
                  'Audits & Assurance',
                  'Financial Management',
                  'Accounting Services',
                  'Loan Financing',
                ].map((service) => (
                  <li key={service}>
                    <span className="text-white/60 text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © {year} FinPro Ledge. All rights reserved.
            </p>
            <p className="text-white/40 text-sm flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-gold fill-gold" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${utmContent}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
