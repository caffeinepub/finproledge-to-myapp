import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield } from "lucide-react";
import type { ReactNode } from "react";
import { useApprovalStatus } from "../hooks/useApprovalStatus";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useIsAdmin";
import PendingApprovalScreen from "./PendingApprovalScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const { isAdmin, isFetched: _adminFetched } = useIsAdmin();
  const {
    isApproved,
    isLoading: approvalLoading,
    isFetched: approvalFetched,
  } = useApprovalStatus();

  const isAuthenticated = !!identity;

  // Step 1: Wait for identity initialization
  if (isInitializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gold mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Step 2: Must be authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access this area. This section is reserved for
            authenticated clients.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={login}>Log In</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Wait for approval/admin status to load
  if (approvalLoading || !approvalFetched) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gold mx-auto mb-4" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // Step 4: Admins bypass approval check
  if (isAdmin) {
    return <>{children}</>;
  }

  // Step 5: Non-approved users see pending screen
  if (!isApproved) {
    return <PendingApprovalScreen />;
  }

  return <>{children}</>;
}
