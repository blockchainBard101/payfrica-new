import { createContext, useContext, useMemo } from "react";
import { Transaction } from "@mysten/sui/transactions";
import {
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui/client";
import {
  useSignTransaction,
  useSuiClient,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { SponsorTxRequestBody } from "@/types/SponsorTx";
import axios from "axios";
import { fromBase64, toBase64 } from "@mysten/sui/utils";

export interface CreateSponsoredTransactionApiResponse {
  bytes: string;
  digest: string;
}

export interface ExecuteSponsoredTransactionApiInput {
  digest: string;
  signature: string;
}

interface SponsorAndExecuteTransactionBlockProps {
  tx: Transaction;
  network: "mainnet" | "testnet";
  options: SuiTransactionBlockResponseOptions;
  includesTransferTx: boolean;
  allowedAddresses?: string[];
}

interface ExecuteTransactionBlockWithoutSponsorshipProps {
  tx: Transaction;
  options: SuiTransactionBlockResponseOptions;
}

interface CustomWalletContextProps {
  isConnected: boolean;
  address?: string;
  sponsorAndExecuteTransactionBlock: (
    props: SponsorAndExecuteTransactionBlockProps
  ) => Promise<SuiTransactionBlockResponse>;
  executeTransactionBlockWithoutSponsorship: (
    props: ExecuteTransactionBlockWithoutSponsorshipProps
  ) => Promise<SuiTransactionBlockResponse | void>;
}

export const CustomWalletContext = createContext<CustomWalletContextProps>({
  isConnected: false,
  address: undefined,
  sponsorAndExecuteTransactionBlock: async () => {
    throw new Error("Not implemented");
  },
  executeTransactionBlockWithoutSponsorship: async () => {},
});

export const useCustomWallet = () => useContext(CustomWalletContext);

export default function CustomWalletProvider({ children }: { children: React.ReactNode }) {
  const suiClient = useSuiClient() as unknown as SuiClient;
  const { mutateAsync: signTransactionBlock } = useSignTransaction();
  const currentAccount = useCurrentAccount();

  const isConnected = !!currentAccount?.address;
  const address = currentAccount?.address;

  const signTransaction = async (bytes: Uint8Array): Promise<string> => {
    const txBlock = Transaction.from(bytes);
    const { signature } = await signTransactionBlock({ transaction: txBlock });
    return signature;
  };

  const sponsorAndExecuteTransactionBlock = async ({
    tx,
    network,
    options,
    includesTransferTx,
    allowedAddresses = [],
  }: SponsorAndExecuteTransactionBlockProps): Promise<SuiTransactionBlockResponse> => {
    try {
      let digest = "";

      if (includesTransferTx) {
        console.log("Sponsoring transaction block...");
        const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });
        const sponsorTxBody: SponsorTxRequestBody = {
          network,
          txBytes: toBase64(txBytes),
          sender: currentAccount?.address!,
          allowedAddresses,
        };

        const { data: { bytes, digest: sponsorDigest } } = await axios.post<CreateSponsoredTransactionApiResponse>("/api/sponsor", sponsorTxBody, { timeout: 7000 });

        const signature = await signTransaction(fromBase64(bytes));
        console.log("Executing sponsored transaction block...");
        await axios.post<unknown>("/api/execute", {
          signature,
          digest: sponsorDigest,
        }, { timeout: 7000 });

        digest = sponsorDigest;
      }

      await suiClient.waitForTransaction({ digest, timeout: 5000 });

      return suiClient.getTransactionBlock({ digest, options });
    } catch (error) {
      console.error("Sponsor and execute failed", error);
      throw new Error("Failed to sponsor and execute transaction block");
    }
  };

  const executeTransactionBlockWithoutSponsorship = async ({
    tx,
    options,
  }: ExecuteTransactionBlockWithoutSponsorshipProps): Promise<SuiTransactionBlockResponse | void> => {
    if (!currentAccount?.address) return;

    tx.setSender(currentAccount.address);
    const txBytes = await tx.build({ client: suiClient });
    const signature = await signTransaction(txBytes);

    return suiClient.executeTransactionBlock({
      transactionBlock: txBytes,
      signature,
      requestType: "WaitForLocalExecution",
      options,
    });
  };

  return (
    <CustomWalletContext.Provider
      value={{
        isConnected,
        address,
        sponsorAndExecuteTransactionBlock,
        executeTransactionBlockWithoutSponsorship,
      }}
    >
      {children}
    </CustomWalletContext.Provider>
  );
}