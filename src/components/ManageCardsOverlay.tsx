import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import {
  FaArrowLeft,
  FaChevronCircleRight,
  FaPlus,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChevronCircleLeft,
  FaMinus,
} from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import { toPng } from "html-to-image";
import Image from "next/image";
import PayfricaCardHeadImg from "../../public/PayfricaCardHeadImg.jpg";
import { useGlobalState } from "../GlobalStateProvider";
import CardOverlay from "./CardOverlay";
import AddFundsOverlay from "./AddFundsOverlay";
import RemoveFundsOverlay from "./RemoveFundsOverlay";
import "../app/ManageCardsOverlay.css";

const ManageCardsOverlay = ({}) => {
  const {
    overlayStates,
    cards,
    setCards,
    numberOfCardsCreated,
    toggleOverlay,
    formatWithCommas,
    addFundsCardIdx,
    setAddFundsCardIdx,
  } = useGlobalState();
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCard, setNewCard] = useState({
    name: "",
    amount: "",
    pin: "",
    deadline: "",
  });
  const [creating, setCreating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [removeFundsCardIdx, setRemoveFundsCardIdx] = useState<number | null>(
    null
  );
  const cardRef = useRef(null);

  const selectedCard = cards[selectedCardIdx];

  const handleFlip = (dir) => {
    setShowBack(false);
    if (dir === "left") {
      setSelectedCardIdx((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    } else {
      setSelectedCardIdx((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    }
  };

  const handleFlipCard = () => setShowBack((prev) => !prev);

  const handleDeactivate = () => {
    setDeactivating(true);
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c, i) =>
          i === selectedCardIdx ? { ...c, amount: 0, status: false } : c
        )
      );
      setDeactivating(false);
    }, 1200);
  };

  const handleSave = () => {
    if (cardRef.current) {
      toPng(cardRef.current).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${selectedCard?.name}-payfrica-card.png`;
        link.href = dataUrl;
        link.click();
      });
    }
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    setCreating(true);
    setTimeout(() => {
      const address = `0x${Math.random().toString(16).slice(2, 18)}`;
      setCards((prev) => [
        ...prev,
        {
          ...newCard,
          address,
          amount: parseFloat(newCard.amount),
          expense: 0,
          transactions: [],
          status: true,
        },
      ]);
      setNewCard({ name: "", amount: "", pin: "", deadline: "" });
      setShowCreateModal(false);
      setCreating(false);
      setSelectedCardIdx(cards.length);
    }, 1200);
  };

  const handleOpenCardTypeSelect = () => {
    toggleOverlay("cardTypeSelect");
  };

  const qrData = JSON.stringify({
    name: selectedCard?.name,
    address: selectedCard?.address,
    amount: selectedCard?.amount,
    pin: selectedCard?.pin,
    deadline: selectedCard?.deadline,
  });

  if (!overlayStates.manageCards || numberOfCardsCreated === 0) return null;
  return (
    <div className="overlay-background" style={{ zIndex: 3000 }}>
      <div className="manage-card-overlay-container">
        {/* Left: Card & Details */}
        <div style={{ flex: 2, minWidth: 0 }}>
          {/* Header */}
          <div className="card-overlay-header">
            <FaTimes
              className="icon"
              onClick={() => toggleOverlay("manageCards")}
            />
            <h2>Manage Cards</h2>
            <BsQuestionCircleFill className="icon" />
          </div>
          <div className="card-carousel" style={{}}>
            <FaChevronCircleLeft
              style={{ fontSize: 35, cursor: "pointer", color: "#c43e26" }}
              onClick={() => handleFlip("left")}
            />
            <div
              style={{
                margin: "0 1.5rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!showBack ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="pay-card front"
                    ref={cardRef}
                    style={{
                      boxShadow: "0 4px 24px #0001",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Image
                        src={PayfricaCardHeadImg}
                        alt="Payfrica Card Header"
                        width={100}
                        height={100}
                        style={{ width: "100%", marginBottom: 0 }}
                      />
                      <div
                        style={{
                          width: "100%",
                          backgroundColor: "#3C53A4",
                          height: 10,
                          marginTop: -5,
                        }}
                      ></div>
                    </div>
                    <div className="card-body">
                      <div className="qr-container">
                        <QRCode value={qrData} size={150} />
                        <div className="qr-corners">
                          <span className="corner tl" />
                          <span className="corner tr" />
                          <span className="corner bl" />
                          <span className="corner br" />
                        </div>
                      </div>
                      <p className="tagline">No Network, No Wahala</p>
                      <p className="pay-id">{selectedCard?.name}</p>
                    </div>
                  </div>
                  <div style={{ padding: "0 1rem 1rem 1rem" }}>
                    <div className="card-usage-row">
                      <div className="card-usage-bar">
                        <div
                          className="card-usage-bar-fill"
                          style={{
                            width: `${Math.min(
                              (selectedCard?.expense /
                                (selectedCard?.amount || 10000)) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="card-usage-labels">
                        <span className="usage-label">Your usage stats</span>
                        <span className="usage-amount">
                          NGN {formatWithCommas(selectedCard?.expense)} / NGN{" "}
                          {formatWithCommas(selectedCard?.amount)}
                        </span>
                        <label className="deactivate-toggle-label">
                          Deactivate card
                          <input
                            type="checkbox"
                            checked={!selectedCard?.status}
                            onChange={handleDeactivate}
                            className="deactivate-toggle"
                          />
                          <span className="deactivate-slider" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="pay-card back"
                  style={{ boxShadow: "0 4px 24px #0001" }}
                >
                  <Image
                    src="/PayfricaCardBg.png"
                    alt="Back of card"
                    width={280}
                    height={455}
                    style={{ width: 280, height: 455, objectFit: "cover" }}
                  />
                </div>
              )}
              <button
                className="save-btn"
                style={{
                  margin: "1rem auto 0",
                  fontSize: 15,
                  width: "100%",
                }}
                onClick={handleFlipCard}
              >
                {showBack ? "Show Front" : "Show Back"}
              </button>
              {!showBack && (
                <button
                  className="save-btn"
                  style={{
                    margin: "0.5rem auto 0",
                    fontSize: 15,
                    width: "100%",
                  }}
                  onClick={handleSave}
                >
                  Save to Device
                </button>
              )}
            </div>
            <FaChevronCircleRight
              //   className="icon"
              style={{ fontSize: 35, cursor: "pointer", color: "#c43e26" }}
              onClick={() => handleFlip("right")}
            />
          </div>
          <div
            style={{
              background: "#fff",
              //   color: "#3c53a4",
              color: "#c43e26",
              borderRadius: 10,
              margin: "2rem 0 0",
              padding: 20,
              minHeight: 180,
              backgroundColor: "#fcf5d7",
              //   padding: "1rem 0",
            }}
          >
            <h3
              style={{
                color: "#3c53a4",
                fontFamily: "LexendExtraBold",
                marginBottom: 16,
              }}
            >
              Transaction history
            </h3>
            {selectedCard?.transactions.length === 0 ? (
              <div className="empty-state">No transactions yet.</div>
            ) : (
              <table className="transaction-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Receiver</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard?.transactions.map((tx, i) => (
                    <tr key={i}>
                      <td>{tx.receiver}</td>
                      <td>{tx.type}</td>
                      <td>{tx.date}</td>
                      <td style={{ fontWeight: 700 }}>{tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Right: Card List/Overview */}
        <div style={{ flex: 1, minWidth: 260, marginLeft: 16 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              minHeight: 600,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              border: "1px solid #c43e26",
            }}
          >
            <h3
              style={{
                color: "#c43e26",
                fontFamily: "LexendExtraBold",
                fontSize: 22,
                marginBottom: 12,
              }}
            >
              Card Overview
            </h3>
            {cards.map((card, idx) => (
              <div
                key={card.address}
                className="balance-card"
                style={{
                  background: selectedCardIdx === idx ? "#3c53a4" : "#fbe19a",
                  color: selectedCardIdx === idx ? "#fff" : "#3c53a4",
                  cursor: "pointer",
                  marginBottom: 8,
                }}
                onClick={() => {
                  setSelectedCardIdx(idx);
                  setShowBack(false);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {card.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      className="add-funds-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddFundsCardIdx(idx);
                        toggleOverlay("addFunds");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3c53a4",
                        fontSize: 20,
                        cursor: "pointer",
                        marginLeft: 8,
                      }}
                      title="Add Funds"
                    >
                      <span style={{ fontSize: 22, fontWeight: 700 }}>+</span>
                    </button>
                    <button
                      className="remove-funds-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRemoveFundsCardIdx(idx);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#c43e26",
                        fontSize: 20,
                        cursor: "pointer",
                        marginLeft: 8,
                      }}
                      title="Remove Funds"
                    >
                      <FaMinus style={{ fontSize: 20, fontWeight: 700 }} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, margin: "8px 0" }}>
                  ₦{card.amount.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: card.status ? "#00c851" : "#c43e26",
                  }}
                >
                  {card.status ? "🟢 Active" : "🔴 Inactive"}
                </div>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <button
              className="save-btn"
              style={{
                background: "#fff",
                color: "#c43e26",
                border: "1.5px dashed #c43e26",
                fontWeight: 700,
                fontSize: 18,
                marginTop: 24,
              }}
              onClick={() => toggleOverlay("cardTypeSelect")}
            >
              <FaPlus style={{ marginRight: 8 }} /> Create New Card
            </button>
          </div>
        </div>
        {/* Card Type Select Overlay */}
        <CardOverlay onTypeSelect={() => setShowCreateModal(true)} />
        {/* Deactivating Loader */}
        {deactivating && (
          <div className="overlay-background" style={{ zIndex: 4000 }}>
            <div className="sending-overlay">
              <div className="loader" />
              <h3>Deactivating card...</h3>
            </div>
          </div>
        )}
        <AddFundsOverlay />
        {/* Remove Funds Overlay */}
        {removeFundsCardIdx !== null && (
          <RemoveFundsOverlay
            cardIdx={removeFundsCardIdx}
            onClose={() => setRemoveFundsCardIdx(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ManageCardsOverlay;
