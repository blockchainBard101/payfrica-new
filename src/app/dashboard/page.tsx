"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navigation,
  Balances,
  QuickActions,
  SavingsCircle,
  TransactionHistory,
} from "@/imports";
import { useCustomWallet } from "@/contexts/CustomWallet";

// Overlay groups
import {
  SendMoneyOverlay,
  PayfricaPadiOverlay,
  EnterAmountOverlay,
  SendingOverlay,
  FeedbackOverlay,
  SuccessOverlay,
  FailedOverlay,
  SendSuiTokenOverlay,
  PayfricaPadiSuiOverlay,
  EnterSuiAmountOverlay,
  SendSuiToWAOverlay,
  ReceiveMoneyOverlay,
  ReceiveCardOverlay,
  ConvertOverlay,
  ConfirmConvertOverlay,
} from "@/imports";

const Dashboard = () => {
  const router = useRouter();
  const { isConnected } = useCustomWallet();

  // useEffect(() => {
  //   if (!isConnected) {
  //     router.push("/login");
  //   }
  // }, [isConnected, router]);

  if (!isConnected) return null;

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <Balances />
      <QuickActions />
      <SavingsCircle />
      <TransactionHistory />

      {/* Send Overlays */}
      <SendMoneyOverlay />
      <PayfricaPadiOverlay />
      <EnterAmountOverlay />
      <SendingOverlay />
      <FeedbackOverlay type="default" />
      <SuccessOverlay />
      <FailedOverlay />

      {/* SUI Send Overlays */}
      <SendSuiTokenOverlay />
      <PayfricaPadiSuiOverlay />
      <EnterSuiAmountOverlay />
      <SendSuiToWAOverlay />

      {/* Receive Overlays */}
      <ReceiveMoneyOverlay />
      <ReceiveCardOverlay />

      {/* Convert Overlays */}
      <ConvertOverlay />
      <ConfirmConvertOverlay />
    </div>
  );
};

export default Dashboard;
