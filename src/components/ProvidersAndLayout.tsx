"use client";
import { ChildrenProps } from "@/types/ChildrenProps";
import React from "react";
import {
  createNetworkConfig,
  SuiClientProvider,
  useSuiClientContext,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';
import clientConfig from "@/config/clientConfig";
import "@mysten/dapp-kit/dist/index.css";
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomWalletProvider from "@/contexts/CustomWallet";

export interface StorageAdapter {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

// const sessionStorageAdapter: StorageAdapter = {
//   getItem: async (key) => {
//     return sessionStorage.getItem(key);
//   },
//   setItem: async (key, value) => {
//     sessionStorage.setItem(key, value);
//   },
//   removeItem: async (key) => {
//     sessionStorage.removeItem(key);
//   },
// };

export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
  const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
  });

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <RegisterEnokiWallets />
        <WalletProvider
        // autoConnect
        >
          <CustomWalletProvider>
            <main>
              {children}
            </main>
          </CustomWalletProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>

  );
};

function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    if (!isEnokiNetwork(network)) return;

    const { unregister } = registerEnokiWallets({
      apiKey: clientConfig.ENOKI_API_KEY,
      providers: {
        google: {
          clientId: clientConfig.GOOGLE_CLIENT_ID,
        },
        facebook: {
          clientId: 'YOUR_FACEBOOK_CLIENT_ID',
        },
        twitch: {
          clientId: 'YOUR_TWITCH_CLIENT_ID',
        },
      },
      client,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}

