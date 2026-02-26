import React from 'react';
import { Link } from '@tanstack/react-router';
import Navigation from './Navigation';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const appId = encodeURIComponent(window.location.hostname || 'finproledge');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <img
                src="/assets/generated/logo.dim_400x120.png"
                alt="FinProLedge"
                className="h-10 w-auto mb-4"
              />
              <p className="text-white/60 text-sm leading-relaxed">
                Delivering rigorous financial services with integrity and precision since 1994.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
                Services
              </h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/service-booking" className="hover:text-gold transition-colors">Income Tax Filing</Link></li>
                <li><Link to="/service-booking" className="hover:text-gold transition-colors">GST Filing</Link></li>
                <li><Link to="/service-booking" className="hover:text-gold transition-colors">TDS Filing</Link></li>
                <li><Link to="/service-booking" className="hover:text-gold transition-colors">Payroll Administration</Link></li>
                <li><Link to="/service-booking" className="hover:text-gold transition-colors">Audits</Link></li>
                <li><Link to="/service-booking" className="hover:text-gold transition-colors">Accounting Services</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
                <li><Link to="/client-portal" className="hover:text-gold transition-colors">Client Portal</Link></li>
                <li><Link to="/compliance" className="hover:text-gold transition-colors">Compliance</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
                Contact Us
              </h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  <a href="tel:+918882101300" className="hover:text-gold transition-colors">
                    +91 8882101300
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold shrink-0" />
                  <a href="mailto:finproledge@gmail.com" className="hover:text-gold transition-colors">
                    finproledge@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>© {new Date().getFullYear()} FinProLedge. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="h-3.5 w-3.5 text-gold fill-gold" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
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
