import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PaymentRecord, PaymentStatus, PaymentMethod, AdminPaymentSettings } from '../backend';

export function useGetMyPayments() {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentRecord[]>({
    queryKey: ['myPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      currencyCode,
      paymentMethod,
      cardType,
    }: {
      amount: bigint;
      currencyCode: string;
      paymentMethod: PaymentMethod;
      cardType: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPayment(amount, currencyCode, paymentMethod, cardType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
    },
  });
}

export function useGetAllPayments() {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentRecord[]>({
    queryKey: ['allPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      status,
    }: {
      paymentId: bigint;
      status: PaymentStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePaymentStatus(paymentId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPayments'] });
    },
  });
}

export function useGetAdminPaymentSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminPaymentSettings | null>({
    queryKey: ['adminPaymentSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminPaymentSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetAdminPaymentSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: AdminPaymentSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setAdminPaymentSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPaymentSettings'] });
    },
  });
}
