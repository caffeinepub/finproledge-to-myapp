import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import LoginButton from './LoginButton';
import { Menu, X, Scale } from 'lucide-react';

const ADMIN_EMAIL = 'finproledge@gmail.com';

export default function Navigation() {
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isAdmin = isAuthenticated && userProfile?.email === ADMIN_EMAIL;

  const navLinks: Array<{
    to: '/' | '/visitor-request' | '/portal' | '/compliance' | '/admin-dashboard' | '/book-service';
    label: string;
    requiresAuth?: boolean;
    adminOnly?: boolean;
  }> = [
    { to: '/', label: 'Home' },
    { to: '/visitor-request', label: 'Service Request' },
    { to: '/portal', label: 'Client Dashboard', requiresAuth: true },
    { to: '/compliance', label: 'Compliance', requiresAuth: true },
    { to: '/admin-dashboard', label: 'Administration', requiresAuth: true, adminOnly: true },
  ];

  const visibleLinks = navLinks.filter(link => {
    if (link.adminOnly) return isAdmin;
    if (link.requiresAuth) return isAuthenticated;
    return true;
  });

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="bg-nav-bg border-b border-nav-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <Scale className="h-4 w-4 text-nav-bg" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-serif font-bold text-base tracking-wide">FINPROLEDGE</span>
              <span className="text-white/50 text-[9px] uppercase tracking-widest font-medium">Chartered Accountants</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive(link.to)
                    ? 'text-accent bg-accent/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && userProfile && (
              <span className="hidden sm:block text-xs text-white/60 font-medium">{userProfile.name}</span>
            )}
            <LoginButton />
            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/70 hover:text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1">
            {visibleLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded transition-colors ${
                  isActive(link.to)
                    ? 'text-accent bg-accent/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
