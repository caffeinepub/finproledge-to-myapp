import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  ToDoItem, ToDoStatus,
  TimelineEntry, TimelineStatus,
  FollowUpItem, FollowUpStatus,
  DeadlineRecord, DeadlineStatus, UrgencyLevel,
} from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

// Local type for ToDoPriority since it's not exported from backend
export type ToDoPriority = 'low' | 'medium' | 'high';

// ─── Admin To-Do Hooks ───────────────────────────────────────────────────────

export function useGetAllToDos() {
  const { actor, isFetching } = useActor();
  return useQuery<ToDoItem[]>({
    queryKey: ['allToDos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllToDos();
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
      assignedClient: Principal | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createToDo(
        params.title,
        params.description,
        params.priority as Parameters<typeof actor.createToDo>[2],
        params.status,
        params.assignedClient,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allToDos'] });
    },
  });
}

// ─── Admin Timeline Hooks ────────────────────────────────────────────────────

export function useGetAllTimelines() {
  const { actor, isFetching } = useActor();
  return useQuery<TimelineEntry[]>({
    queryKey: ['allTimelines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTimelines();
    },
    enabled: !!actor && !isFetching,
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
        params.taskReference,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTimelines'] });
    },
  });
}

// ─── Admin Follow-Up Hooks ───────────────────────────────────────────────────

export function useGetAllFollowUps() {
  const { actor, isFetching } = useActor();
  return useQuery<FollowUpItem[]>({
    queryKey: ['allFollowUps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFollowUps();
    },
    enabled: !!actor && !isFetching,
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
      clientReference: Principal | null;
      status: FollowUpStatus;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFollowUp(
        params.title,
        params.description,
        params.dueDate,
        params.clientReference,
        params.status,
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFollowUps'] });
    },
  });
}

// ─── Admin Deadline Hooks ────────────────────────────────────────────────────

export function useGetAllDeadlines() {
  const { actor, isFetching } = useActor();
  return useQuery<DeadlineRecord[]>({
    queryKey: ['allDeadlines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDeadlines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDeadline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      dueDate: bigint;
      urgencyLevel: UrgencyLevel;
      status: DeadlineStatus;
      deliverableReference: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDeadline(
        params.title,
        params.description,
        params.dueDate,
        params.urgencyLevel,
        params.status,
        params.deliverableReference,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDeadlines'] });
    },
  });
}

// ─── Client-Facing Query Hooks ───────────────────────────────────────────────

export function useGetMyToDos() {
  const { actor, isFetching } = useActor();
  return useQuery<ToDoItem[]>({
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
  return useQuery<TimelineEntry[]>({
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
  return useQuery<FollowUpItem[]>({
    queryKey: ['myFollowUps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyFollowUps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyDeadlines() {
  const { actor, isFetching } = useActor();
  return useQuery<DeadlineRecord[]>({
    queryKey: ['myDeadlines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDeadlines();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Client-Facing Mutation Hooks ────────────────────────────────────────────

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
      return actor.createClientToDo(
        params.title,
        params.description,
        params.priority as Parameters<typeof actor.createClientToDo>[2],
        params.status,
      );
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
        params.status,
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
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFollowUps'] });
    },
  });
}

export function useCreateClientDeadline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      dueDate: bigint;
      urgencyLevel: UrgencyLevel;
      status: DeadlineStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientDeadline(
        params.title,
        params.description,
        params.dueDate,
        params.urgencyLevel,
        params.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeadlines'] });
    },
  });
}

// ─── Client Status Update Mutation Hooks ─────────────────────────────────────

export function useUpdateClientToDoStatus() {
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

export function useUpdateClientTimelineStatus() {
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

export function useUpdateClientFollowUpStatus() {
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

export function useUpdateClientDeadlineStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { deadlineId: bigint; newStatus: DeadlineStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDeadlineStatus(params.deadlineId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeadlines'] });
      queryClient.invalidateQueries({ queryKey: ['allDeadlines'] });
    },
  });
}
