// "use client";
// import { ChildrenProps } from "@/types/ChildrenProps";
// import React from "react";
// import {
//   createNetworkConfig,
//   SuiClientProvider,
//   useSuiClientContext,
//   WalletProvider,
// } from "@mysten/dapp-kit";
// import { getFullnodeUrl } from "@mysten/sui/client";
// import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
// import clientConfig from "@/config/clientConfig";
// import "@mysten/dapp-kit/dist/index.css";
// import { useEffect } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import CustomWalletProvider from "@/contexts/CustomWallet";

// export interface StorageAdapter {
//   setItem(key: string, value: string): Promise<void>;
//   getItem(key: string): Promise<string | null>;
//   removeItem(key: string): Promise<void>;
// }

// // const sessionStorageAdapter: StorageAdapter = {
// //   getItem: async (key) => {
// //     return sessionStorage.getItem(key);
// //   },
// //   setItem: async (key, value) => {
// //     sessionStorage.setItem(key, value);
// //   },
// //   removeItem: async (key) => {
// //     sessionStorage.removeItem(key);
// //   },
// // };
//   const queryClient = new QueryClient();

// export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
//   const { networkConfig } = createNetworkConfig({
//     testnet: { url: getFullnodeUrl("testnet") },
//     mainnet: { url: getFullnodeUrl("mainnet") },
//   });


//   return (
//     <QueryClientProvider client={queryClient}>
//       <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
//         <RegisterEnokiWallets />
//         <WalletProvider autoConnect>
//           <CustomWalletProvider>
//             <main>{children}</main>
//           </CustomWalletProvider>
//         </WalletProvider>
//       </SuiClientProvider>
//     </QueryClientProvider>
//   );
// };

// //NO ISSUE
// function RegisterEnokiWallets() {
//   const { client, network } = useSuiClientContext();

//   useEffect(() => {
//     if (!isEnokiNetwork(network)) return;

//     const { unregister } = registerEnokiWallets({
//       apiKey: clientConfig.ENOKI_API_KEY,
//       providers: {
//         google: {
//           clientId: clientConfig.GOOGLE_CLIENT_ID,
//         },
//         facebook: {
//           clientId: "YOUR_FACEBOOK_CLIENT_ID",
//         },
//         twitch: {
//           clientId: "YOUR_TWITCH_CLIENT_ID",
//         },
//       },
//       client: client as any, // Type assertion to bypass type mismatch
//       network,
//     });

//     return unregister;
//   }, [client, network]);

//   return null;
// }
"use client";

import React, { useEffect } from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import {
  createNetworkConfig,
  SuiClientProvider,
  useSuiClientContext,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import clientConfig from "@/config/clientConfig";
import "@mysten/dapp-kit/dist/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomWalletProvider from "@/contexts/CustomWallet";

export interface StorageAdapter {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

const sessionStorageAdapter: StorageAdapter = {
  async getItem(key: string) {
    const value = sessionStorage.getItem(key);
    // console.log(`[PROD] Getting ${key}:`, value, 'Domain:', window.location.hostname);
    return value;
  },
  async setItem(key: string, value: string) {
    // console.log(`[PROD] Setting ${key}:`, value, 'Domain:', window.location.hostname);
    sessionStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    // console.log(`[PROD] Removing ${key}`, 'Domain:', window.location.hostname);
    sessionStorage.removeItem(key);
  },
};
const queryClient = new QueryClient();

export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
  const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <RegisterEnokiWallets />
        <WalletProvider autoConnect storage={sessionStorageAdapter}>
          <CustomWalletProvider>
            <main>{children}</main>
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
          clientId: "YOUR_FACEBOOK_CLIENT_ID",
        },
        twitch: {
          clientId: "YOUR_TWITCH_CLIENT_ID",
        },
      },
      client: client as any,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}
