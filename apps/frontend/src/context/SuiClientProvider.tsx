"use client";

import {
  createNetworkConfig,
  SuiClientProvider as ClientProvider,
} from "@mysten/dapp-kit";
import React from "react";
import { RPC } from "@/config";

const SuiClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { networkConfig } = createNetworkConfig({
    testnet: { url: RPC },
  });

  // @ts-ignore
  return (
    <ClientProvider networks={networkConfig} defaultNetwork="testnet">
      {children}
    </ClientProvider>
  );
};

export default SuiClientProvider;
