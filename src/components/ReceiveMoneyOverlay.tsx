"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import QRCode from "react-qr-code";
import { FaArrowLeft, FaCopy } from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import { useGlobalState } from "@/GlobalStateProvider";
import { toast } from "react-toastify";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { getFormattedSuiHandle } from "@/hooks/registerNsName";

// Utility to shorten addresses
const shortenAddress = (address, start = 10, end = 10) => {
  if (!address) return "";
  return `${address.slice(0, start)}…${address.slice(-end)}`;
};

export const ReceiveMoneyOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const { address } = useCustomWallet();
  const [payTag, setPayTag] = useState("");
  const [loadingTag, setLoadingTag] = useState(false);

  useEffect(() => {
    if (!address) {
      setPayTag("");
      return;
    }
    setLoadingTag(true);
    const fetchTag = async () => {
      try {
        const tag = await getFormattedSuiHandle(address);
        setPayTag(tag);
      } catch (err) {
        console.error("getFormattedSuiHandle failed", err);
        setPayTag("");
      } finally {
        setLoadingTag(false);
      }
    };
    fetchTag();
  }, [address]);

  const walletAddress = address ?? "";

  const shortenedAddress = useMemo(
    () => shortenAddress(walletAddress),
    [walletAddress]
  );

  const copyToClipboard = useCallback((text) => {
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
          <QRCode
            value={walletAddress}
            size={160}
            bgColor="#FCF5D7"
            fgColor="#000"
          />
        </div>

        <div className="info-block">
          <h2>Payfrica Tag</h2>
          <div className="copy-box">
            {loadingTag ? <p>Loading…</p> : <p>{payTag || "—"}</p>}
            <button
              onClick={() => payTag && copyToClipboard(payTag)}
              disabled={!payTag}
            >
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
