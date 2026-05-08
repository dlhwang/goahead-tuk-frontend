import { apiRequest } from '@/shared/api/httpClient';
import type { Confession, ConfessionDetail, CreateConfessionPayload } from '@/features/confession/model/types';

export function getConfessions() {
  return apiRequest<Confession[]>('/confessions');
}

export function getConfession(confessionId: string) {
  return apiRequest<ConfessionDetail>(`/confessions/${confessionId}`);
}

export function createConfession(payload: CreateConfessionPayload) {
  return apiRequest<ConfessionDetail>('/confessions', {
    method: 'POST',
    body: payload,
  });
}
