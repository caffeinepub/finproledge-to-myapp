import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ToDoDocument } from '../backend';
import { ToDoPriority, ToDoStatus, TimelineStatus, FollowUpStatus } from '../backend';
import { Principal } from '@dfinity/principal';

export { ToDoPriority };

// ── GET ALL TO-DOS ──────────────────────────────────────────────────────────
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

// ── GET ALL TIMELINES ───────────────────────────────────────────────────────
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

// ── GET ALL FOLLOW-UPS ──────────────────────────────────────────────────────
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

// ── GET MY TO-DOS ───────────────────────────────────────────────────────────
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

// ── GET MY TIMELINES ────────────────────────────────────────────────────────
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

// ── GET MY FOLLOW-UPS ───────────────────────────────────────────────────────
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

// ── CREATE TO-DO ────────────────────────────────────────────────────────────
export function useCreateToDo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      priority,
      status,
      assignedClient,
      document,
    }: {
      title: string;
      description: string;
      priority: ToDoPriority;
      status: ToDoStatus;
      assignedClient: Principal | null;
      document: ToDoDocument | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createToDo(title, description, priority, status, assignedClient, document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allToDos'] });
    },
    onError: (error) => {
      console.error('createToDo error:', error);
    },
  });
}

// ── CREATE CLIENT TO-DO ─────────────────────────────────────────────────────
export function useCreateClientToDo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      priority,
      status,
      document,
    }: {
      title: string;
      description: string;
      priority: ToDoPriority;
      status: ToDoStatus;
      document: ToDoDocument | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientToDo(title, description, priority, status, document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myToDos'] });
    },
    onError: (error) => {
      console.error('createClientToDo error:', error);
    },
  });
}

// ── CREATE TIMELINE ENTRY ───────────────────────────────────────────────────
export function useCreateTimelineEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      startDate,
      endDate,
      status,
      taskReference,
      clientPrincipal,
    }: {
      title: string;
      description: string;
      startDate: bigint;
      endDate: bigint;
      status: TimelineStatus;
      taskReference: bigint | null;
      clientPrincipal: Principal | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTimelineEntry(
        title,
        description,
        startDate,
        endDate,
        status,
        taskReference,
        clientPrincipal
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTimelines'] });
    },
    onError: (error) => {
      console.error('createTimelineEntry error:', error);
    },
  });
}

// ── CREATE CLIENT TIMELINE ──────────────────────────────────────────────────
export function useCreateClientTimeline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      startDate,
      endDate,
      status,
    }: {
      title: string;
      description: string;
      startDate: bigint;
      endDate: bigint;
      status: TimelineStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientTimeline(title, description, startDate, endDate, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTimelines'] });
    },
    onError: (error) => {
      console.error('createClientTimeline error:', error);
    },
  });
}

// ── CREATE FOLLOW-UP ────────────────────────────────────────────────────────
export function useCreateFollowUp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      dueDate,
      clientReference,
      status,
      notes,
    }: {
      title: string;
      description: string;
      dueDate: bigint;
      clientReference: Principal | null;
      status: FollowUpStatus;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFollowUp(title, description, dueDate, clientReference, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFollowUps'] });
    },
    onError: (error) => {
      console.error('createFollowUp error:', error);
    },
  });
}

// ── CREATE CLIENT FOLLOW-UP ─────────────────────────────────────────────────
export function useCreateClientFollowUp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      dueDate,
      status,
      notes,
    }: {
      title: string;
      description: string;
      dueDate: bigint;
      status: FollowUpStatus;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientFollowUp(title, description, dueDate, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFollowUps'] });
    },
    onError: (error) => {
      console.error('createClientFollowUp error:', error);
    },
  });
}

// ── UPDATE TO-DO STATUS ─────────────────────────────────────────────────────
export function useUpdateToDoStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ toDoId, status }: { toDoId: bigint; status: ToDoStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateToDoStatus(toDoId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allToDos'] });
      queryClient.invalidateQueries({ queryKey: ['myToDos'] });
    },
  });
}

// ── UPDATE TIMELINE STATUS ──────────────────────────────────────────────────
export function useUpdateTimelineStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ timelineId, status }: { timelineId: bigint; status: TimelineStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimelineStatus(timelineId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTimelines'] });
      queryClient.invalidateQueries({ queryKey: ['myTimelines'] });
    },
  });
}

// ── UPDATE FOLLOW-UP STATUS ─────────────────────────────────────────────────
export function useUpdateFollowUpStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ followUpId, status }: { followUpId: bigint; status: FollowUpStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFollowUpStatus(followUpId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFollowUps'] });
      queryClient.invalidateQueries({ queryKey: ['myFollowUps'] });
    },
  });
}

// ── DEADLINE STUBS (no backend support, kept for compatibility) ─────────────
export function useGetAllDeadlines() {
  return useQuery({
    queryKey: ['allDeadlines'],
    queryFn: async () => [] as never[],
    enabled: false,
  });
}

export function useCreateDeadline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: unknown) => {
      throw new Error('Deadline creation is not supported by the backend');
    },
    onError: (error) => {
      console.error('createDeadline error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDeadlines'] });
    },
  });
}

export function useCreateClientDeadline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: unknown) => {
      throw new Error('Deadline creation is not supported by the backend');
    },
    onError: (error) => {
      console.error('createClientDeadline error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeadlines'] });
    },
  });
}
