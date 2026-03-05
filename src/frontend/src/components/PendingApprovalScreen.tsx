import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, LogOut, ShieldX } from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface PendingApprovalScreenProps {
  isRejected?: boolean;
}

export default function PendingApprovalScreen({
  isRejected = false,
}: PendingApprovalScreenProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (isRejected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-destructive/10 p-5">
              <ShieldX className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Access Request Declined
          </h2>
          <p className="text-muted-foreground mb-2 leading-relaxed">
            Your account access request has been declined by the administrator.
          </p>
          <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
            If you believe this is a mistake, please contact us at{" "}
            <a
              href="mailto:finproledge@gmail.com"
              className="text-gold hover:underline font-medium"
            >
              finproledge@gmail.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:+918882101300"
              className="text-gold hover:underline font-medium"
            >
              +91 8882101300
            </a>
            .
          </p>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-gold/10 p-5 animate-pulse">
            <Clock className="h-12 w-12 text-gold" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Pending Admin Approval
        </h2>
        <p className="text-muted-foreground mb-2 leading-relaxed">
          Your account registration has been received and is awaiting approval
          from an administrator.
        </p>
        <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
          You will gain access to the client portal once your account has been
          approved. This typically takes 1–2 business days. For urgent requests,
          contact us at{" "}
          <a
            href="mailto:finproledge@gmail.com"
            className="text-gold hover:underline font-medium"
          >
            finproledge@gmail.com
          </a>
          .
        </p>
        <div className="rounded-lg border border-gold/20 bg-gold/5 px-6 py-4 mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              What happens next?
            </span>
            <br />
            An admin will review your request and approve or decline your
            access. You'll be able to log in and access all features once
            approved.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
