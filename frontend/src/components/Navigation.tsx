import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, ChevronDown, Shield } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';

const ADMIN_EMAIL = 'finproledge@gmail.com';

const services = [
  {
    name: 'Income Tax Filing',
    href: '/service-booking',
    description: 'Expert assistance with individual and corporate income tax returns to maximize deductions and ensure full compliance.',
  },
  {
    name: 'Corporate Tax Filing',
    href: '/service-booking',
    description: 'Comprehensive corporate tax planning and filing services to minimize liability and meet all statutory deadlines.',
  },
  {
    name: 'GST Filing',
    href: '/service-booking',
    description: 'End-to-end GST registration, return filing, and reconciliation to keep your business fully compliant with GST regulations.',
  },
  {
    name: 'TDS Filing',
    href: '/service-booking',
    description: 'Accurate TDS computation, deduction, and timely filing of returns to avoid penalties and interest charges.',
  },
  {
    name: 'Audits',
    href: '/service-booking',
    description: 'Thorough statutory, internal, and tax audits conducted by experienced professionals to ensure financial accuracy and transparency.',
  },
  {
    name: 'Payroll Administration',
    href: '/service-booking',
    description: 'Complete payroll processing including salary computation, PF/ESI compliance, and payslip generation for your workforce.',
  },
  {
    name: 'Ledger Maintenance',
    href: '/service-booking',
    description: 'Systematic recording and maintenance of financial ledgers to provide a clear and accurate picture of your business finances.',
  },
  {
    name: 'Bank Reconciliation',
    href: '/service-booking',
    description: 'Regular reconciliation of bank statements with your books to detect discrepancies and maintain accurate cash flow records.',
  },
  {
    name: 'Financial Management',
    href: '/service-booking',
    description: 'Strategic financial planning, budgeting, and advisory services to help your business achieve its financial goals.',
  },
  {
    name: 'Accounting Services',
    href: '/service-booking',
    description: 'Full-spectrum bookkeeping and accounting services ensuring your financial records are always up-to-date and audit-ready.',
  },
  {
    name: 'Loan Financing',
    href: '/service-booking',
    description: 'Assistance with loan applications, documentation, and financial structuring to secure the best financing options for your needs.',
  },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  // Only fetch profile when authenticated and not initializing
  const { data: userProfile } = useGetCallerUserProfile();

  // Determine if current user is admin (email match)
  const isAdmin = !isInitializing &&
    isAuthenticated &&
    userProfile?.email?.toLowerCase().trim() === ADMIN_EMAIL;

  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-gold/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/generated/logo.dim_400x120.png" alt="FinProLedge" className="h-10 w-auto" />
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
                className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-gold transition-colors"
                onMouseEnter={() => setServicesOpen(true)}
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services <ChevronDown className="h-4 w-4" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-navy border border-border rounded-lg shadow-xl z-50 max-h-[70vh] overflow-y-auto">
                  <div className="p-2">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block px-3 py-2.5 rounded-md hover:bg-gold/10 transition-colors group"
                        onClick={() => setServicesOpen(false)}
                      >
                        <div className="font-medium text-sm text-foreground group-hover:text-gold transition-colors">
                          {service.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {service.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
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
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
                <Link
                  to="/compliance-admin"
                  className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Compliance Admin
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LoginButton />
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy border-t border-gold/20">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-sm font-medium text-white/80 hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div>
              <button
                className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-gold transition-colors py-2 w-full text-left"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="block py-2"
                      onClick={() => { setMobileMenuOpen(false); setServicesOpen(false); }}
                    >
                      <div className="text-sm font-medium text-white/70 hover:text-gold transition-colors">
                        {service.name}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5 leading-relaxed">
                        {service.description}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="block text-sm font-medium text-white/80 hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              to="/contact"
              className="block text-sm font-medium text-white/80 hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated && (
              <Link
                to="/client-portal"
                className="block text-sm font-medium text-white/80 hover:text-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Client Portal
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/compliance"
                className="block text-sm font-medium text-white/80 hover:text-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Compliance
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin Portal
                </Link>
                <Link
                  to="/compliance-admin"
                  className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Compliance Admin
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
