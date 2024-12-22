"use client";
import { WalletProvider } from "@mysten/dapp-kit";
import React from "react";

const SuiWalletProvider = ({ children }: { children: React.ReactNode }) => {
  return <WalletProvider autoConnect>{children}</WalletProvider>;
};

export default SuiWalletProvider;
