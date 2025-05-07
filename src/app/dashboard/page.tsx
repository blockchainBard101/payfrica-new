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
import EnterWithdrawAmount from "@/components/EnterWithdrawAmount";
import ConfirmWithdrawOverlay from "@/components/ConfirmWithdrawOverlay";
import WithdrawingOverlay from "@/components/WithdrawingOverlay";

const Page = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // simulate your existing loading + redirect logic
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!currentAccount) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
        const res = await fetch(`${baseUrl}/users/${currentAccount.address}/basic`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (e: any) {
        console.error("Failed to fetch user:", e);
        setError(e.message);
      }
    })();
  }, [currentAccount, isLoading, router]);

  if (isLoading) return <div>Loading…</div>;

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

      {/* Withdraw Overlays */}
      <EnterWithdrawAmount />
      <ConfirmWithdrawOverlay />
      <WithdrawingOverlay />
    </div>
  );
};

export default Page;
