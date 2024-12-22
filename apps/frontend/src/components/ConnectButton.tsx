"use client";

import { ConnectButton as Connect } from "@mysten/dapp-kit";

const ConnectButton = () => {
  return (
    <div className="relative inline-block bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-black font-bold text-center text-lg rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer">
      <Connect connectText="CONNECT" />
    </div>
  );
};

export default ConnectButton;
