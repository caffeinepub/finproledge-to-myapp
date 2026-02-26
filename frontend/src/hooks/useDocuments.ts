import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ClientDocument, DocumentType, ExternalBlob } from '../backend';

export function useGetAllDocuments() {
  const { actor, isFetching } = useActor();

  return useQuery<ClientDocument[]>({
    queryKey: ['allDocuments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      docType,
      name,
      mimeType,
      file,
    }: {
      docType: DocumentType;
      name: string;
      mimeType: string;
      file: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadDocument(docType, name, mimeType, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDocuments'] });
    },
  });
}
