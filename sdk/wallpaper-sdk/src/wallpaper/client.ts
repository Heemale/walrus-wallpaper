import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../utils/constants';
import { MODULE_CLOB } from './utils/constants';
import type {
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { Summary } from '../types';
import { AddBlob, AddLibrary, Library } from './types';
import { isValidSuiObjectId } from '@mysten/sui/utils';

export class WallpaperClient {
  constructor(public suiClient: SuiClient) {}

  create(tx: Transaction, state: string, name: string) {
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::create`,
      arguments: [tx.object(state), tx.pure.string(name)],
    });
  }

  addBlob(tx: Transaction, library: string, blob: string) {
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::add_blob`,
      arguments: [tx.object(library), tx.pure.string(blob)],
    });
  }

  getLibraries = async (address: string) => {
    if (!isValidSuiObjectId(address)) throw new Error('Invalid address');
    const state = await this.suiClient.getObject({
      id: address,
      options: {
        showContent: true,
      },
    });
    const libraries = state.data?.content as {
      dataType: string;
      fields?: {
        id: { id: string };
        libraries: string[];
      };
    };
    if (!libraries.fields?.libraries) {
      return [];
    }
    const libraries_objects = await this.suiClient.multiGetObjects({
      ids: libraries.fields?.libraries,
      options: {
        showContent: true,
      },
    });
    const libraries_result: Library[] = libraries_objects.map((library) => {
      if (!library.data?.content) {
        throw new Error('Library content not found');
      }
      const library_detail = library.data.content as unknown as {
        dataType: string;
        fields: {
          id: { id: string };
          name: string;
          b36addr: string;
          owner: string;
          blobs: string[];
        };
      };
      return {
        id: library_detail.fields?.id,
        name: library_detail.fields?.name,
        b36addr: library_detail.fields?.b36addr,
        owner: library_detail.fields?.owner,
        blobs: library_detail.fields?.blobs,
      };
    });
    return libraries_result;
  };

  async getAllAddLibrary(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<AddLibrary>> {
    const resp = await this.suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULE_CLOB}::AddLibrary`,
      },
      ...input,
    });
    const data = resp.data.map((event) => {
      const rawEvent = event.parsedJson as any;
      return {
        id: rawEvent.id as string,
        name: rawEvent.name as string,
        owner: rawEvent.owner as string,
        b36addr: rawEvent.b36addr as string,
        eventId: event.id,
        timestampMs: event.timestampMs,
      };
    });
    return {
      data,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }

  async getAllAddBlob(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<AddBlob>> {
    const resp = await this.suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULE_CLOB}::AddBlob`,
      },
      ...input,
    });
    const data = resp.data.map((event) => {
      const rawEvent = event.parsedJson as any;
      return {
        libraryId: rawEvent.library_id as string,
        owner: rawEvent.owner as string,
        blob: rawEvent.blob as string,
        eventId: event.id,
        timestampMs: event.timestampMs,
      };
    });
    return {
      data,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }

  async queryEvents(
    eventName: string,
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ) {
    // @ts-ignore
    return this.suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULE_CLOB}::${eventName}`,
      },
      ...input,
    });
  }

  createEventMapper<T>(customMapping: (rawEvent: any) => T) {
    return (event: any) => ({
      ...customMapping(event.parsedJson),
      eventId: event.id,
      timestampMs: event.timestampMs,
    });
  }

  handleEventReturns<T>(resp: any, customMapping: (rawEvent: any) => T) {
    const eventMapper = this.createEventMapper(customMapping);
    const data = resp.data.map(eventMapper);
    return {
      data,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }
}
