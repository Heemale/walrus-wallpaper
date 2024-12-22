"use client";
import QueryClientProvider from "./QueryClientProvider";
import SuiClientProvider from "./SuiClientProvider";
import SuiWalletProvider from "./SuiWalletProvider";

const Context = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <SuiClientProvider>
        <SuiWalletProvider>{children}</SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default Context;
