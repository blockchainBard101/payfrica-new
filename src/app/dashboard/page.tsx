"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";

import { SendMoneyOverlay } from "@/components/SendMoneyOverlay";
import { Navigation } from "@/components/Navigations";
import { BalanceCards } from "@/components/Balances";
import { QuickActions } from "@/components/QuickActions";
import { SavingsCircle } from "@/components/SavingsCircle";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PayfricaPadiOverlay } from "@/components/PayfricaPadiOverlay";
import { EnterAmountOverlay } from "@/components/EnterAmountOverlay";
import { SendingOverlay } from "@/components/SendingOverlay";
import { FeedbackOverlay } from "@/components/FeedbackOverlay";
import { SuccessOverlay } from "@/components/SuccessOverlay";
import { FailedOverlay } from "@/components/FailedOverlay";
import { SendSuiTokenOverlay } from "@/components/SendSuiTokenOverlay";
import { PayfricaPadiSuiOverlay } from "@/components/PayfricaPadiSuiOverlay";
import { EnterSuiAmountOverlay } from "@/components/EnterSuiAmountOverlay";
import { SendSuiToWAOverlay } from "@/components/SendSuiToWAOverlay";
import { ReceiveMoneyOverlay } from "@/components/ReceiveMoneyOverlay";
import { ReceiveCardOverlay } from "@/components/ReceiveCardOverlay";
import { ConvertOverlay } from "@/components/ConvertOverlay";
import { ConfirmConvertOverlay } from "@/components/ConfirmConvertOverlay";
import { DepositTypeOverlay } from "@/components/DepositTypeOverlay";
import QuickTransfer from "@/components/QuickTransfer";
import ConfirmDepositOverlay from "@/components/ConfirmDepositOverlay";
import MakeDepositOverlay from "@/components/MakeDepositOverlay";

const Page = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(true);

  //This is the component that first run
  useEffect(() => {
    if (!isLoading) return;

    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return; //If the component is still loading, just back tf off, allow it to finish loading

    //Loading is done ✅, lets check if the wallet is connected or not
    if (!currentAccount) {
      //Oops the wallet is not connected, redirect to /login
      router.push("/login");
      console.log("Not connected");
    }
  }, [currentAccount, isLoading]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <BalanceCards />
      <QuickActions />
      <SavingsCircle />
      <TransactionHistory />

      {/* Send Overlays */}
      <SendMoneyOverlay />
      <PayfricaPadiOverlay />
      <EnterAmountOverlay />
      <SendingOverlay />
      <FeedbackOverlay />
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

      {/* Deposit Overlays */}
      <DepositTypeOverlay />
      <QuickTransfer />
      <ConfirmDepositOverlay />
      <MakeDepositOverlay />
    </div>
  );
};

export default Page;
