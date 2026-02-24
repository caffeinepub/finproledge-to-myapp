import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access this area. This section is reserved for authenticated clients.
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

  return <>{children}</>;
}
