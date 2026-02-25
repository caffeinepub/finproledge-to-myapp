import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ComplianceDeliverable, DeliverableStatus, DeliverableType } from '../backend';
import { Principal } from '@dfinity/principal';

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

export function useGetAllComplianceDeliverables() {
  const { actor, isFetching } = useActor();

  return useQuery<ComplianceDeliverable[]>({
    queryKey: ['allComplianceDeliverables'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllComplianceDeliverables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDeliverable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clientPrincipal,
      title,
      dueDate,
      deliverableType,
    }: {
      clientPrincipal: Principal;
      title: string;
      dueDate: bigint;
      deliverableType: DeliverableType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDeliverable(clientPrincipal, title, dueDate, deliverableType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allComplianceDeliverables'] });
      queryClient.invalidateQueries({ queryKey: ['myDeliverables'] });
    },
  });
}
