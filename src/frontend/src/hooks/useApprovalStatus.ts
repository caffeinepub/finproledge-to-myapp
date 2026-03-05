import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";
import { useIsAdmin } from "./useIsAdmin";

export function useApprovalStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();
  const hasRequestedRef = useRef(false);

  const isAuthenticated = !!identity;

  const query = useQuery<boolean>({
    queryKey: ["isCallerApproved"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
    staleTime: 30_000,
  });

  const isApproved = query.data ?? false;
  const isLoading = actorFetching || query.isLoading;
  const isFetched = !!actor && query.isFetched;

  // Auto-submit approval request when user is authenticated, not approved, not admin, and hasn't requested yet
  useEffect(() => {
    if (
      !actor ||
      actorFetching ||
      !isAuthenticated ||
      !isFetched ||
      isApproved ||
      isAdmin ||
      hasRequestedRef.current
    ) {
      return;
    }

    hasRequestedRef.current = true;
    actor
      .requestApproval()
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["isCallerApproved"] });
        queryClient.invalidateQueries({ queryKey: ["approvals"] });
      })
      .catch(() => {
        // Silently ignore — user may have already requested
      });
  }, [
    actor,
    actorFetching,
    isAuthenticated,
    isFetched,
    isApproved,
    isAdmin,
    queryClient,
  ]);

  // Reset the ref when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasRequestedRef.current = false;
    }
  }, [isAuthenticated]);

  return {
    isApproved,
    isLoading,
    isFetched,
  };
}
