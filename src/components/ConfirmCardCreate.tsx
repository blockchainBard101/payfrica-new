import React, { useState } from "react";
import { SuccessOverlay } from "./SuccessOverlay";
import { FailedOverlay } from "./FailedOverlay";
import { useGlobalState } from "@/GlobalStateProvider";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";
import { getAllowlistedKeyServers, SealClient } from "@mysten/seal";
import clientConfig from "@/config/clientConfig";
import { fromHex, toHex } from "@mysten/sui/utils";
import { useCustomWallet } from "@/contexts/CustomWallet";

export type Data = {
  status: string;
  blobId: string;
  endEpoch: string;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  blobUrl: string;
  suiUrl: string;
  isImage: string;
};

type WalrusService = {
  id: string;
  name: string;
  publisherUrl: string;
  aggregatorUrl: string;
};

// interface ConfirmCardCreateProps {
//   cardName: string;
//   cardAmount: string;
//   cardFee: string;
//   paymentMethod: string;
//   paymentMethod2?: string;
//   currency: string;
//   onClose: () => void;
//   onSuccess?: () => void;
//   onFailure?: () => void;
// }

const ConfirmCardCreate = () => {
  const {
    overlayStates,
    toggleOverlay,
    cardDetails,
    currency,
    formatCurrency,
  } = useGlobalState();
  const [status, setStatus] = useState<"idle" | "success" | "failed">("idle");
  const [selectedService, setSelectedService] = useState<string>("service1");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [info, setInfo] = useState<Data | null>(null);
  const { address } = useCustomWallet();

  const NUM_EPOCH = 1;
  const packageId = clientConfig.PACKAGE_ID;
  const suiClient = useSuiClient();
  const client = new SealClient({
    suiClient,
    serverObjectIds: getAllowlistedKeyServers("testnet").map((id) => [id, 0]),
    verifyKeyServers: false,
  });

  const SUI_VIEW_TX_URL = `https://suiscan.xyz/testnet/tx`;
  const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/testnet/object`;

  const services: WalrusService[] = [
    {
      id: "service1",
      name: "walrus.space",
      publisherUrl: "https://publisher.walrus-testnet.walrus.space",
      aggregatorUrl: "https://aggregator.walrus-testnet.walrus.space",
    },
    {
      id: "service2",
      name: "staketab.org",
      publisherUrl: "https://wal-publisher-testnet.staketab.org",
      aggregatorUrl: "https://wal-aggregator-testnet.staketab.org",
    },
    {
      id: "service3",
      name: "redundex.com",
      publisherUrl: "https://walrus-testnet-publisher.redundex.com",
      aggregatorUrl: "https://walrus-testnet-aggregator.redundex.com",
    },
    {
      id: "service4",
      name: "nodes.guru",
      publisherUrl: "https://walrus-testnet-publisher.nodes.guru",
      aggregatorUrl: "https://walrus-testnet-aggregator.nodes.guru",
    },
    {
      id: "service5",
      name: "banansen.dev",
      publisherUrl: "https://publisher.walrus.banansen.dev",
      aggregatorUrl: "https://aggregator.walrus.banansen.dev",
    },
    {
      id: "service6",
      name: "everstake.one",
      publisherUrl: "ttps://walrus-testnet-publisher.everstake.one",
      aggregatorUrl: "https://walrus-testnet-aggregator.everstake.one",
    },
  ];

  function getAggregatorUrl(path: string): string {
    const service = services.find((s) => s.id === selectedService);
    const cleanPath = path.replace(/^\/+/, "").replace(/^v1\//, "");
    return `${service?.aggregatorUrl}/v1/${cleanPath}`;
  }

  function getPublisherUrl(path: string): string {
    const service = services.find((s) => s.id === selectedService);
    console.log(service);
    const cleanPath = path.replace(/^\/+/, "").replace(/^v1\//, "");
    console.log(`${service?.publisherUrl}/v1/${cleanPath}`);
    // return `${service?.publisherUrl}/v1/${cleanPath}`;
    console.log(`${service?.publisherUrl}/v1/${cleanPath}`);
    return `${service?.publisherUrl}/v1/${cleanPath}`;
  }

  const storeBlob = (encryptedData: Uint8Array) => {
    return fetch(`${getPublisherUrl(`/v1/blobs?epochs=${NUM_EPOCH}`)}`, {
      method: "PUT",
      body: encryptedData,
    }).then((response) => {
      if (response.status === 200) {
        return response.json().then((info) => {
          return { info };
        });
      } else {
        alert(
          "Error publishing the blob on Walrus, please select a different Walrus service."
        );
        setIsUploading(false);
        throw new Error("Something went wrong when storing the blob!");
      }
    });
  };

  const displayUpload = (storage_info: any, media_type: any) => {
    let info;
    if ("alreadyCertified" in storage_info) {
      info = {
        status: "Already certified",
        blobId: storage_info.alreadyCertified.blobId,
        endEpoch: storage_info.alreadyCertified.endEpoch,
        suiRefType: "Previous Sui Certified Event",
        suiRef: storage_info.alreadyCertified.event.txDigest,
        suiBaseUrl: SUI_VIEW_TX_URL,
        blobUrl: getAggregatorUrl(
          `/v1/blobs/${storage_info.alreadyCertified.blobId}`
        ),
        suiUrl: `${SUI_VIEW_OBJECT_URL}/${storage_info.alreadyCertified.event.txDigest}`,
        isImage: media_type.startsWith("image"),
      };
    } else if ("newlyCreated" in storage_info) {
      info = {
        status: "Newly created",
        blobId: storage_info.newlyCreated.blobObject.blobId,
        endEpoch: storage_info.newlyCreated.blobObject.storage.endEpoch,
        suiRefType: "Associated Sui Object",
        suiRef: storage_info.newlyCreated.blobObject.id,
        suiBaseUrl: SUI_VIEW_OBJECT_URL,
        blobUrl: getAggregatorUrl(
          `/v1/blobs/${storage_info.newlyCreated.blobObject.blobId}`
        ),
        suiUrl: `${SUI_VIEW_OBJECT_URL}/${storage_info.newlyCreated.blobObject.id}`,
        isImage: media_type.startsWith("image"),
      };
    } else {
      throw Error("Unhandled successful response!");
    }
    console.log("info", info);
    setInfo(info);
  };

  const sealEncryptAndUpload = async (phrase: string) => {
    console.log("Uploading...");
    setIsUploading(true);
    try {
      const textBytes = new TextEncoder().encode(phrase);
      const nonce = crypto.getRandomValues(new Uint8Array(5));
      const policyObjectBytes = fromHex(address);
      const id = toHex(new Uint8Array([...policyObjectBytes, ...nonce]));
      console.log("Encrypting...", packageId);
      const { encryptedObject: encryptedBytes } = await client.encrypt({
        threshold: 2,
        packageId,
        id,
        data: textBytes,
      });

      console.log("Uploading to Walrus...");

      const storageInfo = await storeBlob(encryptedBytes);
      displayUpload(storageInfo.info, "text");
      console.log("Successfully uploaded to Walrus!");
      console.log(info);
      setIsUploading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateCard = async () => {
    try {
      const res = await fetch("/api/create-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: cardDetails.pin }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      await sealEncryptAndUpload(data.encrypted);
      console.log(data);
      console.log("Wallet Created:", data);
    } catch (err) {
      console.error("Failed to create wallet:", err);
    } finally {
    }

    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   const isSuccess = Math.random() > 0.5;
    //   if (isSuccess) {
    //     toggleOverlay("success");
    //     toggleOverlay("confirmCardCreate");
    //     // setStatus("success");
    //     // if (onSuccess) onSuccess();
    //   } else {
    //     toggleOverlay("failed");
    //     toggleOverlay("confirmCardCreate");
    //     throw new Error("Simulated failure");
    //   }
    // } catch (e) {
    //   //   setStatus("failed");
    //   toggleOverlay("failed");
    //   toggleOverlay("confirmCardCreate");
    //   // if (onFailure) onFailure();
    // }
  };

  if (!overlayStates.confirmCardCreate) return null;
  //   if (status === "success") return <SuccessOverlay />;
  //   if (status === "failed") return <FailedOverlay />;

  return (
    <div className="card-overlay-background">
      <div className="confirm-card-modal confirm-card-overlay-modal">
        <button
          className="card-overlay-close-btn"
          onClick={() => toggleOverlay("confirmCardCreate")}
          aria-label="Close"
        >
          ×
        </button>
        <div className="confirm-card-header">
          <div className="confirm-card-title">
            You are Creating a Payfrica Card with
          </div>
          <div className="confirm-card-currency">
            {formatCurrency(cardDetails.amount)} {currency}
          </div>
          <div className="confirm-card-desc">
            Confirm the infomation below to create card...
          </div>
        </div>
        <div className="confirm-card-details">
          <div className="confirm-card-row">
            <span className="confirm-card-label">Card&apos;s Name</span>
            <span className="confirm-card-value">{cardDetails.name}</span>
          </div>
          <div className="confirm-card-row">
            <span className="confirm-card-label">Fee</span>
            <span className="confirm-card-value">
              {formatCurrency(cardDetails.amount * (1 / 100))}
            </span>
          </div>
          <div className="confirm-card-row">
            <span className="confirm-card-label">Payment method</span>
            <span className="confirm-card-value">Payfrica Wallet</span>
          </div>
          {/* {paymentMethod2 && (
            <div className="confirm-card-row">
              <span className="confirm-card-label">Payment method</span>
              <span className="confirm-card-value">
                {cardDetails.paymentMethod2}
              </span>
            </div>
          )} */}
        </div>
        <button className="confirm-card-btn" onClick={handleCreateCard}>
          Create Card
        </button>
      </div>
    </div>
  );
};

export default ConfirmCardCreate;
