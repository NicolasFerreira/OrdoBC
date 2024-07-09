"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { baseSepolia, hardhat } from "wagmi/chains";

const chains = process.env.NODE_ENV === "production" ? [baseSepolia] : [hardhat, baseSepolia]

const config = getDefaultConfig({
  appName: "OrdoBC",
  projectId: process.env.CLOUD_WALLET_KEY,
  chains: chains,
  ssr: true,
});

const queryClient = new QueryClient();

const RainbowKitAndWagmiProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitAndWagmiProvider;
