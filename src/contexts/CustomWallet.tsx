import { createContext, useContext, useMemo } from "react";
import { Transaction } from "@mysten/sui/transactions";
import {
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui/client";
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { SponsorTxRequestBody } from "@/types/SponsorTx";
import axios from "axios";
import { fromBase64, toBase64 } from "@mysten/sui/utils";
import { enokiClient } from "@/utils";
import clientConfig from "@/config/clientConfig";
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
  ) => Promise<boolean>;
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
  executeTransactionBlockWithoutSponsorship: async () => { },
});

export const useCustomWallet = () => useContext(CustomWalletContext);

export default function CustomWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const suiClient = useSuiClient() as unknown as SuiClient;
  const { mutateAsync: signTransactionBlock } = useSignTransaction();
  const account = useCurrentAccount();
  const address = account?.address; 


  console.log({ "custom wallet": address, isConnected: !!address });

  const isConnected = !!address;

  const signTransaction = async (bytes: string): Promise<string> => {
    // const txBlock = Transaction.from(bytes);
    const { signature } = await signTransactionBlock({ transaction: bytes });
    return signature;
  };

  const sponsorAndExecuteTransactionBlock = async ({
    tx,
    network,
    options,
    includesTransferTx,
    allowedAddresses = [],
  }: SponsorAndExecuteTransactionBlockProps): Promise<boolean> => {
    try {
      let digest = "";

      if (includesTransferTx) {
        console.log("Sponsoring transaction block...");
        const txBytes = await tx.build({
          client: suiClient,
          onlyTransactionKind: true,
        });
        // const sponsorTxBody: SponsorTxRequestBody = {
        //   network,
        //   txBytes: toBase64(txBytes),
        //   sender: wallet!,
        //   allowedAddresses,
        // };

        // const { data: { bytes, digest: sponsorDigest } } = await axios.post<CreateSponsoredTransactionApiResponse>("/api/sponsor", sponsorTxBody, { timeout: 7000 });

        const { bytes, digest } = await enokiClient.createSponsoredTransaction({
          network: clientConfig.SUI_NETWORK_NAME,
          transactionKindBytes: toBase64(txBytes),
          sender: address,
          allowedMoveCallTargets: ["0x2::kiosk::set_owner_custom"],
          allowedAddresses: allowedAddresses,
        });

        const signature = await signTransaction(bytes);
        console.log("Executing sponsored transaction block...");

        const resp = await enokiClient.executeSponsoredTransaction({
          digest,
          signature,
        });
        if (resp) {
          return true;
        }
        return false;
        // console.log(resp)
        // await axios.post<unknown>("/api/execute", {
        //   signature,
        //   digest: sponsorDigest,
        // }, { timeout: 7000 });

        // digest = sponsorDigest;
        // return suiClient.getTransactionBlock({ digest, options });
      }

      // await suiClient.waitForTransaction({ digest, timeout: 5000 });
    } catch (error) {
      console.error("Sponsor and execute failed", error);
      throw new Error("Failed to sponsor and execute transaction block");
    }
  };

  const executeTransactionBlockWithoutSponsorship = async ({
    tx,
    options,
  }: ExecuteTransactionBlockWithoutSponsorshipProps): Promise<SuiTransactionBlockResponse | void> => {
    if (!address) return;

    tx.setSender(address);
    const txBytes = await tx.build({ client: suiClient });
    const signature = await signTransaction(txBytes as unknown as string);

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
