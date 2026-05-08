import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createConfession, getConfession, getConfessions } from '@/features/confession/api/confessionApi';
import type { CreateConfessionPayload } from '@/features/confession/model/types';

export const confessionKeys = {
  all: ['confessions'] as const,
  detail: (confessionId: string) => ['confessions', confessionId] as const,
};

export function useConfessionsQuery() {
  return useQuery({
    queryKey: confessionKeys.all,
    queryFn: getConfessions,
  });
}

export function useConfessionDetailQuery(confessionId: string) {
  return useQuery({
    queryKey: confessionKeys.detail(confessionId),
    queryFn: () => getConfession(confessionId),
    enabled: Boolean(confessionId),
  });
}

export function useCreateConfessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConfessionPayload) => createConfession(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: confessionKeys.all });
    },
  });
}
