import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LeadRequestInput,
  RequestStatus,
  ServiceRequest,
  ServiceRequestInput,
  ServiceType,
  Time,
} from "../backend";
import { useActor } from "./useActor";

export function useGetMyRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceRequest[]>({
    queryKey: ["myRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceRequest[]>({
    queryKey: ["allRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllServiceRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceRequest[]>({
    queryKey: ["allServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceType,
      description,
      deadline,
    }: {
      serviceType: ServiceType;
      description: string;
      deadline: Time;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createRequest(serviceType, description, deadline);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allServiceRequests"] });
    },
  });
}

export function useCreateVisitorRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ServiceRequestInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createVisitorRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allServiceRequests"] });
    },
  });
}

export function useCreateVisitorRequestWithLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LeadRequestInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createVisitorRequestWithLead(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allServiceRequests"] });
    },
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: { requestId: bigint; status: RequestStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateStatus(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allServiceRequests"] });
    },
  });
}
