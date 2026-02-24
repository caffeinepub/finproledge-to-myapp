import React from 'react';
import Navigation from './Navigation';
import { Scale, Heart } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown-app';
  const utmContent = encodeURIComponent(hostname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-primary border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-accent rounded flex items-center justify-center">
                  <Scale className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-serif font-bold text-sm tracking-wide text-white">FINPROLEDGE</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                Chartered Accountants & Financial Advisors. Delivering rigorous financial services with integrity and precision since 1994.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">Services</h4>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li>Income & Corporate Tax Filing</li>
                <li>Audit & Assurance Services</li>
                <li>Payroll Administration</li>
                <li>Ledger Maintenance & Reconciliation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">Contact</h4>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li>finproledge@gmail.com</li>
                <li>Client Portal Available 24/7</li>
                <li>30+ Years of Professional Practice</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} FINPROLEDGE. All rights reserved.
            </p>
            <p className="text-white/40 text-xs flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-accent fill-accent" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${utmContent}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors"
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
