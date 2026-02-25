import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X, Shield, LayoutDashboard } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';

const ADMIN_EMAIL = 'finproledge@gmail.com';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const isAdmin = isAuthenticated && userProfile?.email === ADMIN_EMAIL;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/request-service', label: 'Request Service' },
    ...(isAuthenticated ? [
      { href: '/client-portal', label: 'Client Portal' },
      { href: '/compliance', label: 'Compliance' },
    ] : []),
  ];

  return (
    <nav className="bg-nav-bg border-b border-nav-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/assets/generated/logo.dim_400x120.png" alt="FinProLedge" className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                activeProps={{ className: 'px-3 py-2 rounded-md text-sm font-medium text-white bg-white/15' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Links — only for finproledge@gmail.com */}
            {isAdmin && (
              <>
                <Link
                  to="/admin-dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-amber-300/80 hover:text-amber-200 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  activeProps={{ className: 'px-3 py-2 rounded-md text-sm font-medium text-amber-200 bg-white/15 flex items-center gap-1.5' }}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Admin
                </Link>
                <Link
                  to="/compliance-admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-amber-300/80 hover:text-amber-200 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  activeProps={{ className: 'px-3 py-2 rounded-md text-sm font-medium text-amber-200 bg-white/15 flex items-center gap-1.5' }}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Compliance Admin
                </Link>
              </>
            )}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center">
            <LoginButton />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  activeProps={{ className: 'px-3 py-2 rounded-md text-sm font-medium text-white bg-white/15' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin Links — only for finproledge@gmail.com */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin-dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-amber-300/80 hover:text-amber-200 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/compliance-admin"
                    className="px-3 py-2 rounded-md text-sm font-medium text-amber-300/80 hover:text-amber-200 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Compliance Admin
                  </Link>
                </>
              )}

              <div className="pt-2 border-t border-white/10 mt-1">
                <LoginButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
