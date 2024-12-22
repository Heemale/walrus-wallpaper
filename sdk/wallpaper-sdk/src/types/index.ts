import { EventId } from '@mysten/sui/client';

export interface TransactionSummary {
  eventId: EventId;
  timestampMs?: string | null;
}

export interface Summary<T> {
  data: Array<T>;
  hasNextPage: boolean;
  nextCursor?: EventId | null;
}

export * from './index';
