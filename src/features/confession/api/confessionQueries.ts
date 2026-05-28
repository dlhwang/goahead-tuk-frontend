import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createConfession,
  deselectConfessionReaction,
  getConfession,
  getConfessions,
  selectConfessionReaction,
} from '@/features/confession/api/confessionApi';
import type { CreateConfessionPayload, ReactionType } from '@/features/confession/model/types';

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

type ToggleReactionPayload = {
  type: ReactionType;
  selected: boolean;
};

export function useConfessionReactionMutation(confessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, selected }: ToggleReactionPayload) =>
      selected
        ? deselectConfessionReaction(confessionId, type)
        : selectConfessionReaction(confessionId, type),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: confessionKeys.all });
      void queryClient.invalidateQueries({ queryKey: confessionKeys.detail(confessionId) });
    },
  });
}
