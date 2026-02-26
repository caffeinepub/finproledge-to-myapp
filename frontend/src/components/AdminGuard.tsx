import React, { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { ShieldX, Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'finproledge@gmail.com';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const [backendAdminCheck, setBackendAdminCheck] = useState<boolean | null>(null);
  const [checkingBackend, setCheckingBackend] = useState(false);

  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  // Check backend admin status
  useEffect(() => {
    if (!actor || actorFetching || !isAuthenticated) {
      setBackendAdminCheck(null);
      return;
    }
    setCheckingBackend(true);
    actor.isAdminUser()
      .then((result) => {
        setBackendAdminCheck(result);
      })
      .catch(() => {
        setBackendAdminCheck(false);
      })
      .finally(() => {
        setCheckingBackend(false);
      });
  }, [actor, actorFetching, isAuthenticated]);

  // Step 1: Wait for identity initialization
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  // Step 2: Must be authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You must be logged in to access the admin portal.
        </p>
      </div>
    );
  }

  // Step 3: Wait for actor and backend check
  if (actorFetching || checkingBackend || backendAdminCheck === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  // Step 4: Must be backend admin
  if (!backendAdminCheck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You do not have administrator privileges to access this portal.
        </p>
      </div>
    );
  }

  // Step 5: Wait for profile to load
  if (profileLoading || !profileFetched) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  // Step 6: Enforce email restriction — only finproledge@gmail.com
  const profileEmail = userProfile?.email?.toLowerCase().trim() ?? '';
  if (profileEmail !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md">
          This admin portal is restricted to authorized personnel only.
          Your account ({userProfile?.email || 'unknown'}) does not have access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
