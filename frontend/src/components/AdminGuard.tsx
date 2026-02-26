import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Shield } from 'lucide-react';

const ADMIN_EMAILS = ['finproledge@gmail.com'];

// localStorage key for storing email per principal
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

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const principalId = identity?.getPrincipal().toString() ?? '';

  const { data: isBackendAdmin, isLoading: adminLoading } = useNavIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  // Email-based override: check profile email OR locally-stored email (for unapproved users)
  const profileEmail = userProfile?.email ?? '';
  const localEmail = principalId ? getLocalEmail(principalId) : null;
  const effectiveEmail = profileEmail || localEmail || '';
  const isEmailAdmin = ADMIN_EMAILS.includes(effectiveEmail);

  // Grant access if backend confirms admin OR email matches
  const hasAdminAccess = isBackendAdmin === true || isEmailAdmin;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground">Please log in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  // Wait for backend admin check to complete
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If backend says not admin, wait for profile to load to check email override
  // But only block if we don't already have a local email match
  if (!isBackendAdmin && !isEmailAdmin && profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If backend says not admin and profile is fetched but email doesn't match,
  // show an email verification prompt so the admin can identify themselves
  if (!hasAdminAccess && profileFetched && !profileLoading) {
    return <AdminEmailVerification principalId={principalId} />;
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Inline email verification component for admin access
function AdminEmailVerification({ principalId }: { principalId: string }) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [granted, setGranted] = React.useState(false);

  const handleVerify = () => {
    const trimmed = email.trim().toLowerCase();
    if (ADMIN_EMAILS.includes(trimmed)) {
      // Store in localStorage for future sessions
      try {
        const stored = localStorage.getItem(LOCAL_EMAIL_KEY);
        const map = stored ? (JSON.parse(stored) as Record<string, string>) : {};
        map[principalId] = trimmed;
        localStorage.setItem(LOCAL_EMAIL_KEY, JSON.stringify(map));
      } catch {
        // ignore
      }
      setGranted(true);
      // Force a page reload so AdminGuard re-evaluates with the new localStorage value
      window.location.reload();
    } else {
      setError('This email does not have admin access.');
    }
  };

  if (granted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Access granted, loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Verify Admin Access</h2>
        <p className="text-muted-foreground mb-6">
          Enter your admin email address to verify your identity.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            placeholder="admin@example.com"
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            onClick={handleVerify}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Verify Access
          </button>
        </div>
      </div>
    </div>
  );
}
