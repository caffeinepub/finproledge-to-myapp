import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ClientDeliverable, ClientDeliverableInput, ClientDeliverableStatus } from '../backend';

export function useGetMyClientDeliverables() {
  const { actor, isFetching } = useActor();

  return useQuery<ClientDeliverable[]>({
    queryKey: ['myClientDeliverables'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySubmittedDeliverables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllClientDeliverables() {
  const { actor, isFetching } = useActor();

  return useQuery<ClientDeliverable[]>({
    queryKey: ['allClientDeliverables'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmittedDeliverables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitClientDeliverable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ClientDeliverableInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDeliverable(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClientDeliverables'] });
    },
  });
}

export function useUpdateClientDeliverableStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deliverableId,
      newStatus,
    }: {
      deliverableId: bigint;
      newStatus: ClientDeliverableStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClientDeliverableStatus(deliverableId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClientDeliverables'] });
      queryClient.invalidateQueries({ queryKey: ['allClientDeliverables'] });
    },
  });
}
