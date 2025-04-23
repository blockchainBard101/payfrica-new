"use client";
import { useState, useEffect } from "react";
import { LuMoveLeft } from "react-icons/lu";
import { useGlobalState } from "../GlobalStateProvider";
import { BsQrCodeScan } from "react-icons/bs";
import { nameExists } from "@/hooks/registerNsName";
import { getTokenBalance } from "@/hooks/getCoinBalance";
import { useCustomWallet } from "@/contexts/CustomWallet";
import Image from "next/image";

export const EnterSuiAmountOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const isVisible = overlayStates.enterSuiAmount; // ✅ control visibility, don't skip hooks

  const { address } = useCustomWallet();
  const [amount, setAmount] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagExists, setTagExists] = useState(null);
  const [currency, setCurrency] = useState("NGNC");
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const suffix = "@payfrica";

  useEffect(() => {
    if (tagInput.trim().length > 4) {
      const fullTag = tagInput + suffix;
      nameExists(fullTag).then((exists) => {
        setTagExists(exists);
      });
    } else {
      setTagExists(null);
    }
  }, [tagInput, suffix]);

  useEffect(() => {
    async function fetchBalance() {
      if (!address) return;
      setLoadingBalance(true);
      try {
        const bal = await getTokenBalance(address, currency);
        setBalance(bal);
      } catch (err) {
        console.error(err);
        setBalance(null);
      } finally {
        setLoadingBalance(false);
      }
    }
    fetchBalance();
  }, [currency, address]);

  const isTagValid = tagInput.trim().length > 3 && !tagInput.includes(" ");
  const isAmountValid = amount && parseFloat(amount) > 0;
  const isSendActive = isTagValid && isAmountValid;

  let tagMessage = "*Tag must be at least 4 characters long*";
  let tagMessageColor = "#555";

  if (tagInput.trim().length > 4) {
    if (tagExists) {
      tagMessage = "Valid Payfrica Tag";
      tagMessageColor = "green";
    } else {
      tagMessage = "Tag Does not exist";
      tagMessageColor = "red";
    }
  }

  return (
    <div
      className="overlay-background"
      style={{
        display: isVisible ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div className="enter-amount-overlay">
        <div className="overlay-header">
          <LuMoveLeft
            className="back-icon"
            onClick={() => {
              toggleOverlay("payfricaPadiSui");
              toggleOverlay("enterSuiAmount");
            }}
          />
          <BsQrCodeScan className="qrcodeicon" />
        </div>

        <div className="recipient-info">
          <Image
            src={"/src/Assets/Images/PayfricaNavLogo.png"}
            alt="Payfrica Logo"
            width={40}
            height={40}
          />
        </div>

        <div className="payfrica-tag-section" style={{ margin: "20px 0" }}>
          <h3 style={{ color: "#333" }}>Enter Recipient Tag</h3>
          <div
            className="payfrica-tag-wrapper"
            style={{ position: "relative", width: "100%" }}
          >
            <input
              type="text"
              placeholder="Recipient Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                fontFamily: "InterLight",
                fontSize: "16px",
                outline: "none",
                border: "1px solid #ccc",
                paddingRight: "100px",
              }}
            />
            <span
              className="payfrica-tag-suffix"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#555",
              }}
            >
              {suffix}
            </span>
          </div>
          <small
            style={{
              display: "block",
              marginTop: "5px",
              fontFamily: "InterLight",
              color: tagMessageColor,
            }}
          >
            {tagMessage}
          </small>
        </div>

        <div className="amount-entry">
          <h3 style={{ color: "#333" }}>Enter Amount</h3>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              fontFamily: "InterLight",
              fontSize: "16px",
              outline: "none",
              border: "1px solid #ccc",
            }}
          />
          <select
            name="currency"
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              fontFamily: "InterLight",
              fontSize: "16px",
              outline: "none",
              border: "1px solid #ccc",
              marginTop: "10px",
            }}
          >
            <option value="USDC">USDC</option>
            <option value="SUI">SUI</option>
          </select>
          <div
            style={{
              marginTop: "5px",
              fontFamily: "InterLight",
              fontSize: "14px",
              color: "#333",
            }}
          >
            {loadingBalance
              ? "Loading balance..."
              : `Balance: ${balance ?? "0"}`}
          </div>
          <div className="amount-options" style={{ marginTop: "10px" }}>
            {["100", "200", "500", "1000"].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                style={{ marginRight: "5px" }}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        <button
          className="send-money-button"
          disabled={!isSendActive}
          style={{
            opacity: isSendActive ? 1 : 0.5,
            cursor: isSendActive ? "pointer" : "not-allowed",
            marginTop: "15px",
          }}
          onClick={() => {
            toggleOverlay("sending");
            toggleOverlay("enterSuiAmount");
          }}
        >
          Send Sui Token
        </button>
      </div>
    </div>
  );
};
