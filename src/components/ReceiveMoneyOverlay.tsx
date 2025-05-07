// src/components/ReceiveMoneyOverlay.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import QRCode from "react-qr-code";
import { FaArrowLeft, FaCopy } from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import { useGlobalState } from "@/GlobalStateProvider";
import { toast } from "react-toastify";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useUserDetails } from "@/hooks/useTokenExchange";

// Utility to shorten addresses
type ShortenFn = (address: string, start?: number, end?: number) => string;
const shortenAddress: ShortenFn = (address, start = 10, end = 10) => {
  if (!address) return "";
  return `${address.slice(0, start)}…${address.slice(-end)}`;
};

export const ReceiveMoneyOverlay: React.FC = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const { address } = useCustomWallet();

  // Fetch user details for username (tag)
  const userDetails = useUserDetails(address);
  const [payTag, setPayTag] = useState<string>("");
  const loadingTag = userDetails === null;

  // Update payTag when userDetails arrive
  useEffect(() => {
    if (!userDetails) {
      setPayTag("");
      return;
    }
    setPayTag(userDetails.username + "@payfrica");
  }, [userDetails]);

  const walletAddress = address ?? "";
  const shortenedAddress = useMemo(() => shortenAddress(walletAddress), [walletAddress]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  }, []);

  if (!overlayStates.receiveMoney) return null;

  return (
    <div className="overlay-background">
      <div className="receive-money-container">
        <div className="receive-header">
          <FaArrowLeft
            className="icon"
            onClick={() => toggleOverlay("receiveMoney")}
          />
          <h2>Receive Money</h2>
          <BsQuestionCircleFill className="icon" />
        </div>

        <div className="qr-wrapper">
          <QRCode value={walletAddress} size={160} bgColor="#FCF5D7" fgColor="#000" />
        </div>

        <div className="info-block">
          <h2>Payfrica Tag</h2>
          <div className="copy-box">
            {loadingTag ? <p>Loading…</p> : <p>{payTag || "—"}</p>}
            <button onClick={() => payTag && copyToClipboard(payTag)} disabled={!payTag}>
              <FaCopy /> Copy
            </button>
          </div>
        </div>

        <div className="info-block">
          <h2>Wallet Address</h2>
          <div className="copy-box">
            <p title={walletAddress}>{shortenedAddress}</p>
            <button onClick={() => copyToClipboard(walletAddress)}>
              <FaCopy /> Copy
            </button>
          </div>
        </div>

        <p className="note">
          This address can only be used to receive compatible tokens.
        </p>

        <button
          className="share-btn"
          onClick={() => {
            toggleOverlay("receiveMoney");
            toggleOverlay("receiveCard");
          }}
        >
          Share address
        </button>
      </div>
    </div>
  );
};
