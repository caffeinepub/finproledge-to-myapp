import { Link, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';

const ADMIN_EMAIL = 'finproledge@gmail.com';

interface NavDropdownProps {
  label: string;
  to: string;
  highlight?: boolean;
  children: { label: string; to: string }[];
}

function NavDropdown({ label, to, highlight, children }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseClass = highlight
    ? 'text-gold hover:text-gold/80 hover:bg-gold/10'
    : 'text-white/80 hover:text-white hover:bg-white/10';

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center">
        <Link
          to={to}
          className={`px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-200 ${baseClass}`}
        >
          {label}
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`px-1 py-2 rounded-sm text-sm font-medium transition-colors duration-200 ${baseClass}`}
          aria-label={`Toggle ${label} submenu`}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-navy border border-white/15 rounded shadow-xl z-50 py-1">
          {children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                highlight
                  ? 'text-gold/90 hover:text-gold hover:bg-gold/10'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clientPortalOpen, setClientPortalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();
  const isAdmin = isAuthenticated && userProfile?.email === ADMIN_EMAIL;

  const baseLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about-us' },
    { label: 'Contact Us', to: '/contact' },
    ...(isAuthenticated ? [{ label: 'Service Booking', to: '/service-booking' }] : []),
  ];

  return (
    <nav className="bg-navy border-b border-white/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/generated/logo.dim_400x120.png"
              alt="FinPro Ledge"
              className="h-8 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              FinPro <span className="text-gold">Ledge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {baseLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-200 text-white/80 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}

            {/* Client Portal dropdown */}
            {isAuthenticated && (
              <NavDropdown
                label="Client Portal"
                to="/client-portal"
                children={[{ label: 'Compliance', to: '/compliance' }]}
              />
            )}

            {/* Admin dropdown */}
            {isAdmin && (
              <NavDropdown
                label="Admin"
                to="/admin"
                highlight
                children={[{ label: 'Compliance Admin', to: '/compliance-admin' }]}
              />
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LoginButton />
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white/80 hover:text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-4 py-3 space-y-1">
          {baseLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-200 text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Client Portal section in mobile */}
          {isAuthenticated && (
            <>
              <div className="border-t border-white/10 pt-1 mt-1">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setClientPortalOpen((v) => !v)}
                >
                  <span>Client Portal</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${clientPortalOpen ? 'rotate-180' : ''}`} />
                </button>
                <Link
                  to="/client-portal"
                  className="block px-3 py-2 rounded-sm text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  → Overview
                </Link>
                {clientPortalOpen && (
                  <Link
                    to="/compliance"
                    className="block pl-6 pr-3 py-2 rounded-sm text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    Compliance
                  </Link>
                )}
              </div>
            </>
          )}

          {/* Admin section in mobile */}
          {isAdmin && (
            <>
              <div className="border-t border-white/10 pt-1 mt-1">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-medium text-gold hover:bg-gold/10 transition-colors duration-200"
                  onClick={() => setAdminOpen((v) => !v)}
                >
                  <span>Admin</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${adminOpen ? 'rotate-180' : ''}`} />
                </button>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-sm text-sm font-medium text-gold/80 hover:text-gold hover:bg-gold/10 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  → Dashboard
                </Link>
                {adminOpen && (
                  <Link
                    to="/compliance-admin"
                    className="block pl-6 pr-3 py-2 rounded-sm text-sm font-medium text-gold/70 hover:text-gold hover:bg-gold/10 transition-colors duration-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    Compliance Admin
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
