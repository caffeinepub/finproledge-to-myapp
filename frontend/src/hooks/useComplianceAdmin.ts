import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ToDoStatus, TimelineStatus, FollowUpStatus, ToDoPriority } from '../backend';

export { ToDoPriority };

export function useGetAllToDos() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allToDos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllToDos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTimelines() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allTimelines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTimelines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllFollowUps() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allFollowUps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFollowUps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyToDos() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['myToDos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyToDos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyTimelines() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['myTimelines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTimelines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyFollowUps() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['myFollowUps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyFollowUps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateToDo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      priority: ToDoPriority;
      status: ToDoStatus;
      assignedClient: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      const assignedClient = params.assignedClient ? Principal.fromText(params.assignedClient) : null;
      return actor.createToDo(params.title, params.description, params.priority, params.status, assignedClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allToDos'] });
      queryClient.invalidateQueries({ queryKey: ['myToDos'] });
    },
  });
}

export function useCreateTimeline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      startDate: bigint;
      endDate: bigint;
      status: TimelineStatus;
      taskReference: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTimelineEntry(
        params.title,
        params.description,
        params.startDate,
        params.endDate,
        params.status,
        params.taskReference
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTimelines'] });
      queryClient.invalidateQueries({ queryKey: ['myTimelines'] });
    },
  });
}

export function useCreateFollowUp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      dueDate: bigint;
      clientReference: string | null;
      status: FollowUpStatus;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      const clientReference = params.clientReference ? Principal.fromText(params.clientReference) : null;
      return actor.createFollowUp(
        params.title,
        params.description,
        params.dueDate,
        clientReference,
        params.status,
        params.notes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFollowUps'] });
      queryClient.invalidateQueries({ queryKey: ['myFollowUps'] });
    },
  });
}

export function useCreateClientToDo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      priority: ToDoPriority;
      status: ToDoStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientToDo(params.title, params.description, params.priority, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myToDos'] });
    },
  });
}

export function useCreateClientTimeline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      startDate: bigint;
      endDate: bigint;
      status: TimelineStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientTimeline(
        params.title,
        params.description,
        params.startDate,
        params.endDate,
        params.status
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTimelines'] });
    },
  });
}

export function useCreateClientFollowUp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      dueDate: bigint;
      status: FollowUpStatus;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientFollowUp(
        params.title,
        params.description,
        params.dueDate,
        params.status,
        params.notes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFollowUps'] });
    },
  });
}

export function useUpdateToDoStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { toDoId: bigint; newStatus: ToDoStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateToDoStatus(params.toDoId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myToDos'] });
      queryClient.invalidateQueries({ queryKey: ['allToDos'] });
    },
  });
}

export function useUpdateTimelineStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { timelineId: bigint; newStatus: TimelineStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimelineStatus(params.timelineId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTimelines'] });
      queryClient.invalidateQueries({ queryKey: ['allTimelines'] });
    },
  });
}

export function useUpdateFollowUpStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { followUpId: bigint; newStatus: FollowUpStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFollowUpStatus(params.followUpId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFollowUps'] });
      queryClient.invalidateQueries({ queryKey: ['allFollowUps'] });
    },
  });
}
