import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ComplianceDeliverable, DeliverableStatus } from '../backend';

export function useGetMyDeliverables() {
  const { actor, isFetching } = useActor();

  return useQuery<ComplianceDeliverable[]>({
    queryKey: ['myDeliverables'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDeliverables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyPendingDeliverables() {
  const { actor, isFetching } = useActor();

  return useQuery<ComplianceDeliverable[]>({
    queryKey: ['myPendingDeliverables'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPendingDeliverables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDeliverables() {
  const { actor, isFetching } = useActor();

  return useQuery<ComplianceDeliverable[]>({
    queryKey: ['allDeliverables'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDeliverables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateDeliverableStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deliverableId,
      newStatus,
    }: {
      deliverableId: bigint;
      newStatus: DeliverableStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDeliverableStatus(deliverableId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeliverables'] });
      queryClient.invalidateQueries({ queryKey: ['myPendingDeliverables'] });
      queryClient.invalidateQueries({ queryKey: ['allDeliverables'] });
    },
  });
}
