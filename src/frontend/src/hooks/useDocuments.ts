import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ClientDocument,
  DocumentType,
  ExternalBlob,
  Lead,
} from "../backend";
import { useActor } from "./useActor";

export function useGetAllDocuments() {
  const { actor, isFetching } = useActor();

  return useQuery<ClientDocument[]>({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllLeads(options?: { refetchInterval?: number }) {
  const { actor, isFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ["allLeads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeads();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: options?.refetchInterval,
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
      if (!actor) throw new Error("Actor not available");
      return actor.uploadDocument(docType, name, mimeType, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
    },
  });
}
