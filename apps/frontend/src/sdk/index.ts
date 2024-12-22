import { RPC } from "@/config";
import { SuiClient } from "@mysten/sui/client";
import { WallpaperClient } from "@local/wallpaper-sdk/wallpaper";
import type { GetCoinMetadataParams, CoinMetadata } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import type { DevInspectResults } from "@mysten/sui/client";

export const suiClient = new SuiClient({ url: RPC });
export const wallpaperClient = new WallpaperClient(suiClient);

export const getCoinMetaData = async (
  input: GetCoinMetadataParams,
): Promise<CoinMetadata | null> => {
  return suiClient.getCoinMetadata(input);
};

export const devInspectTransactionBlock = async (
  tx: Transaction,
  sender: string,
): Promise<DevInspectResults> => {
  return await suiClient.devInspectTransactionBlock({
    transactionBlock: tx,
    sender,
  });
};

export const devTransaction = async (tx: Transaction, sender: string) => {
  const res = await devInspectTransactionBlock(tx, sender);
  // @ts-ignore
  if (res.effects.status.status === "failure") {
    // @ts-ignore
    throw new Error(res.effects.status.error);
  }
};
