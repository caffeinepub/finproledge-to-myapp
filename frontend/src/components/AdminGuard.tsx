import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Shield, ShieldX, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const ADMIN_EMAIL = 'finproledge@gmail.com';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  // Show loading while initializing auth or fetching profile
  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access the Admin Dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={login}>Log In</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but profile not yet fetched — wait
  if (!isFetched) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Authenticated but not the admin email — access denied
  const isAdmin = userProfile?.email === ADMIN_EMAIL;
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <ShieldX className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the Admin Dashboard. This area is restricted to authorized administrators only.
          </p>
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
