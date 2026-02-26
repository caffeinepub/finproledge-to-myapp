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
  if (!principalId) return null;
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
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const principalId = identity?.getPrincipal().toString() ?? '';

  const { actor, isFetching: actorFetching } = useActor();

  const { data: isBackendAdmin, isLoading: adminLoading } = useNavIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  // Email-based override: check profile email OR locally-stored email (for unapproved users)
  // Always normalize to lowercase for comparison
  const profileEmail = (userProfile?.email ?? '').trim().toLowerCase();
  // Only read localStorage once we have a stable principalId (identity fully loaded)
  const localEmail = (principalId && !isInitializing) ? getLocalEmail(principalId) : null;
  const effectiveEmail = profileEmail || localEmail || '';
  const isEmailAdmin = ADMIN_EMAILS.includes(effectiveEmail);

  // Grant access if backend confirms admin OR email matches
  const hasAdminAccess = isBackendAdmin === true || isEmailAdmin;

  // --- Loading states ---

  // 1. Wait for Internet Identity to finish initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // 2. Must be authenticated
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

  // 3. Wait for actor to be ready
  if (actorFetching || !actor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  // 4. Wait for backend admin check
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

  // 5. If backend says admin → grant immediately, no need to wait for profile
  if (isBackendAdmin === true) {
    return <>{children}</>;
  }

  // 6. If we already have a local email match → grant immediately
  if (localEmail && ADMIN_EMAILS.includes(localEmail)) {
    return <>{children}</>;
  }

  // 7. Wait for profile to load (it may contain the admin email)
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // 8. Profile loaded — check email
  if (profileEmail && ADMIN_EMAILS.includes(profileEmail)) {
    return <>{children}</>;
  }

  // 9. All checks done, no access found — show email verification form
  if (profileFetched) {
    return <AdminEmailVerification principalId={principalId} />;
  }

  // 10. Fallback loading (shouldn't normally reach here)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Verifying admin access...</p>
      </div>
    </div>
  );
}

// Inline email verification component for admin access
function AdminEmailVerification({ principalId }: { principalId: string }) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [granted, setGranted] = React.useState(false);

  const handleVerify = () => {
    const trimmed = email.trim().toLowerCase();
    if (ADMIN_EMAILS.includes(trimmed)) {
      // Store in localStorage keyed by principal for future sessions
      try {
        const stored = localStorage.getItem(LOCAL_EMAIL_KEY);
        const map = stored ? (JSON.parse(stored) as Record<string, string>) : {};
        map[principalId] = trimmed;
        localStorage.setItem(LOCAL_EMAIL_KEY, JSON.stringify(map));
      } catch {
        // ignore storage errors
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
