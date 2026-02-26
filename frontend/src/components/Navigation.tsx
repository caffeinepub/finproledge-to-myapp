import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import LoginButton from './LoginButton';
import { Menu, X, ChevronDown, Shield } from 'lucide-react';

const ADMIN_EMAILS = ['finproledge@gmail.com'];
const LOCAL_EMAIL_KEY = 'user_email_by_principal';

function getLocalEmail(principalId: string): string | null {
  try {
    const stored = localStorage.getItem(LOCAL_EMAIL_KEY);
    if (!stored) return null;
    const map = JSON.parse(stored) as Record<string, string>;
    return map[principalId] ?? null;
  } catch {
    return null;
  }
}

function useNavIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export default function Navigation() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const principalId = identity?.getPrincipal().toString() ?? '';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const { data: isBackendAdmin } = useNavIsCallerAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  // Email-based override: check profile email OR locally-stored email (for unapproved users)
  const profileEmail = userProfile?.email ?? '';
  const localEmail = principalId ? getLocalEmail(principalId) : null;
  const effectiveEmail = profileEmail || localEmail || '';
  const isEmailAdmin = ADMIN_EMAILS.includes(effectiveEmail);

  const isAdmin = isBackendAdmin === true || isEmailAdmin;

  const services = [
    { label: 'Income Tax Filing', href: '/services/income-tax' },
    { label: 'Corporate Tax Filing', href: '/services/corporate-tax' },
    { label: 'Audits', href: '/services/audits' },
    { label: 'Payroll Administration', href: '/services/payroll' },
    { label: 'GST Filing', href: '/services/gst' },
    { label: 'TDS Filing', href: '/services/tds' },
    { label: 'Financial Management', href: '/services/financial-management' },
    { label: 'Accounting Services', href: '/services/accounting' },
    { label: 'Loan Financing', href: '/services/loan-financing' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-gold/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/assets/generated/logo.dim_400x120.png" alt="FinLogic" className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
              <button
                onMouseEnter={() => setServicesOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                Services <ChevronDown className="w-4 h-4" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-navy border border-gold/20 rounded-md shadow-lg py-1 z-50">
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      to={s.href as any}
                      className="block px-4 py-2 text-sm text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about-us"
              className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
            >
              Contact
            </Link>

            {isAuthenticated && (
              <Link
                to="/client-portal"
                className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                Client Portal
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/compliance"
                className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                Compliance
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LoginButton />
            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/80 hover:text-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy border-t border-gold/20 px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-sm font-medium text-white/80 hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className="block text-sm font-medium text-white/80 hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block text-sm font-medium text-white/80 hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
          {isAuthenticated && (
            <Link
              to="/client-portal"
              className="block text-sm font-medium text-white/80 hover:text-gold transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Client Portal
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/compliance"
              className="block text-sm font-medium text-white/80 hover:text-gold transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Compliance
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
          <div className="pt-2">
            <LoginButton />
          </div>
        </div>
      )}
    </nav>
  );
}
