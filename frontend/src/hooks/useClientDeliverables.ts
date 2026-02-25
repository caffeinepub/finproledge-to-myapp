import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ClientDeliverableStatus, ExternalBlob } from '../backend';

export function useGetMyClientDeliverables() {
  const { actor, isFetching } = useActor();
  return useQuery({
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
  return useQuery({
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
    mutationFn: async (params: {
      title: string;
      description: string;
      file: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDeliverable({
        title: params.title,
        description: params.description,
        file: params.file,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClientDeliverables'] });
      queryClient.invalidateQueries({ queryKey: ['allClientDeliverables'] });
    },
  });
}

export function useSubmitDeliverableForClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      clientPrincipal: string;
      title: string;
      description: string;
      file: Uint8Array;
      onProgress?: (pct: number) => void;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      let blob = ExternalBlob.fromBytes(params.file as Uint8Array<ArrayBuffer>);
      if (params.onProgress) {
        blob = blob.withUploadProgress(params.onProgress);
      }
      return actor.submitDeliverableForClient({
        clientPrincipal: Principal.fromText(params.clientPrincipal),
        title: params.title,
        description: params.description,
        file: blob,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClientDeliverables'] });
      queryClient.invalidateQueries({ queryKey: ['myClientDeliverables'] });
    },
  });
}

export function useUpdateClientDeliverableStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { deliverableId: bigint; newStatus: ClientDeliverableStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClientDeliverableStatus(params.deliverableId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClientDeliverables'] });
      queryClient.invalidateQueries({ queryKey: ['allClientDeliverables'] });
    },
  });
}
