import { apiRequest } from '@/shared/api/httpClient';
import type {
  Confession,
  ConfessionDetail,
  CreateConfessionPayload,
  ReactionType,
} from '@/features/confession/model/types';

export function getConfessions() {
  return apiRequest<Confession[]>('/api/confessions');
}

export function getConfession(confessionId: string) {
  return apiRequest<ConfessionDetail>(`/api/confessions/${confessionId}`);
}

export function createConfession(payload: CreateConfessionPayload) {
  return apiRequest<ConfessionDetail>('/api/confessions', {
    method: 'POST',
    body: payload,
  });
}

export function selectConfessionReaction(confessionId: string, type: ReactionType) {
  return apiRequest<void>(`/api/confessions/${confessionId}/reactions/${type}`, {
    method: 'PUT',
  });
}

export function deselectConfessionReaction(confessionId: string, type: ReactionType) {
  return apiRequest<void>(`/api/confessions/${confessionId}/reactions/${type}`, {
    method: 'DELETE',
  });
}
