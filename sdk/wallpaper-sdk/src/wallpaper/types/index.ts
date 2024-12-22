import { TransactionSummary } from '../../types';

export interface AddLibrary extends TransactionSummary {
  id: string;
  name: string;
  owner: string;
  b36addr: string;
}

export interface AddBlob extends TransactionSummary {
  libraryId: string;
  owner: string;
  blob: string;
}

export type Library = {
  id: { id: string };
  name: string;
  b36addr: string;
  owner: string;
  blobs: string[];
};
