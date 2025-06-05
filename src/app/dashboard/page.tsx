// app/page.tsx (or pages/index.tsx)
"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import LogoLoader from "@/components/LogoLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthGuard } from "@/components/auth-guard";

const Navigation = dynamic(
  () => import("@/components/Navigations").then((mod) => mod.Navigation),
  { ssr: false }
);
const BalanceCards = dynamic(
  () => import("@/components/Balances").then((mod) => mod.default),
  { ssr: false }
);
const QuickActions = dynamic(
  () => import("@/components/QuickActions").then((mod) => mod.QuickActions),
  { ssr: false }
);
const SavingsCircle = dynamic(
  () => import("@/components/SavingsCircle").then((mod) => mod.SavingsCircle),
  { ssr: false }
);
const TransactionHistory = dynamic(
  () =>
    import("@/components/TransactionHistory").then(
      (mod) => mod.TransactionHistory
    ),
  { ssr: false }
);

// Overlays
const SendMoneyOverlay = dynamic(
  () =>
    import("@/components/SendMoneyOverlay").then((mod) => mod.SendMoneyOverlay),
  { ssr: false }
);
const PayfricaPadiOverlay = dynamic(
  () =>
    import("@/components/PayfricaPadiOverlay").then(
      (mod) => mod.PayfricaPadiOverlay
    ),
  { ssr: false }
);
const EnterAmountOverlay = dynamic(
  () =>
    import("@/components/EnterAmountOverlay").then(
      (mod) => mod.EnterAmountOverlay
    ),
  { ssr: false }
);
const SendingOverlay = dynamic(
  () => import("@/components/SendingOverlay").then((mod) => mod.SendingOverlay),
  { ssr: false }
);
const FeedbackOverlay = dynamic(
  () =>
    import("@/components/FeedbackOverlay").then((mod) => mod.FeedbackOverlay),
  { ssr: false }
);
const SuccessOverlay = dynamic(
  () => import("@/components/SuccessOverlay").then((mod) => mod.SuccessOverlay),
  { ssr: false }
);
const FailedOverlay = dynamic(
  () => import("@/components/FailedOverlay").then((mod) => mod.FailedOverlay),
  { ssr: false }
);
const SendSuiTokenOverlay = dynamic(
  () =>
    import("@/components/SendSuiTokenOverlay").then(
      (mod) => mod.SendSuiTokenOverlay
    ),
  { ssr: false }
);
const PayfricaPadiSuiOverlay = dynamic(
  () =>
    import("@/components/PayfricaPadiSuiOverlay").then(
      (mod) => mod.PayfricaPadiSuiOverlay
    ),
  { ssr: false }
);
const EnterSuiAmountOverlay = dynamic(
  () =>
    import("@/components/EnterSuiAmountOverlay").then(
      (mod) => mod.EnterSuiAmountOverlay
    ),
  { ssr: false }
);
const SendSuiToWAOverlay = dynamic(
  () =>
    import("@/components/SendSuiToWAOverlay").then(
      (mod) => mod.SendSuiToWAOverlay
    ),
  { ssr: false }
);
const ReceiveMoneyOverlay = dynamic(
  () =>
    import("@/components/ReceiveMoneyOverlay").then(
      (mod) => mod.ReceiveMoneyOverlay
    ),
  { ssr: false }
);
const ReceiveCardOverlay = dynamic(
  () =>
    import("@/components/ReceiveCardOverlay").then(
      (mod) => mod.ReceiveCardOverlay
    ),
  { ssr: false }
);
const ConvertOverlay = dynamic(
  () => import("@/components/ConvertOverlay").then((mod) => mod.ConvertOverlay),
  { ssr: false }
);
// const ConfirmConvertOverlay = dynamic(
//   () =>
//     import("@/components/ConfirmConvertOverlay").then(
//       (mod) => mod.ConfirmConvertOverlay
//     ),
//   { ssr: false }
// );
const DepositTypeOverlay = dynamic(
  () =>
    import("@/components/DepositTypeOverlay").then(
      (mod) => mod.DepositTypeOverlay
    ),
  { ssr: false }
);
const QuickTransfer = dynamic(() => import("@/components/QuickTransfer"), {
  ssr: false,
});
const ConfirmDepositOverlay = dynamic(
  () => import("@/components/ConfirmDepositOverlay"),
  { ssr: false }
);
const MakeDepositOverlay = dynamic(
  () => import("@/components/MakeDepositOverlay"),
  { ssr: false }
);
const EnterWithdrawAmount = dynamic(
  () => import("@/components/EnterWithdrawAmount"),
  { ssr: false }
);
const ConfirmWithdrawOverlay = dynamic(
  () => import("@/components/ConfirmWithdrawOverlay"),
  { ssr: false }
);
const WithdrawingOverlay = dynamic(
  () => import("@/components/WithdrawingOverlay"),
  { ssr: false }
);
const CardOverlay = dynamic(() => import("@/components/CardOverlay"), {
  ssr: false,
});
const CardDetails = dynamic(() => import("@/components/CardDetails"), {
  ssr: false,
});
const ConfirmCardCreate = dynamic(
  () => import("@/components/ConfirmCardCreate"),
  { ssr: false }
);
const ManageCardsOverlay = dynamic(
  () => import("@/components/ManageCardsOverlay"),
  { ssr: false }
);
const ScanCode = dynamic(() => import("@/components/ScanCode"), {
  ssr: false,
});
const ReceiveFundsFlowOverlay = dynamic(
  () => import("@/components/ReceiveFundsFlowOverlay"),
  { ssr: false }
);
const SendFundsFlowOverlay = dynamic(
  () => import("@/components/SendFundsFlowOverlay"),
  { ssr: false }
);

// SWR fetcher

//fetch(url).then((res) => {
//  if (!res.ok) throw new Error(`HTTP ${res.status}`);
//  return res.json();
//});

export default function Page() {
  //const {
  //  data: user,
  //  error,
  //  isLoading,
  //} = useSWR(
  //  `${process.env.NEXT_PUBLIC_API_URL}/users/${currentAccount.address}/basic`,
  //  fetcher,
  //  { revalidateOnFocus: false, isPaused: () => !!currentAccount }
  //  );

  return (
    // <AuthGuard className="min-h-screen w-full bg-background relative">
    <>
      {/* Dashboard widgets mount and start fetching balances immediately */}
      <Suspense fallback={null}>
        <Navigation />
        <BalanceCards />
        <QuickActions />
        <SavingsCircle />
        <TransactionHistory />
      </Suspense>

      {/* All overlays, loaded on demand */}
      <Suspense fallback={null}>
        <SendMoneyOverlay />
        <PayfricaPadiOverlay />
        <EnterAmountOverlay />
        <SendingOverlay />
        <FeedbackOverlay />
        <ManageCardsOverlay />
        <CardDetails />
        <SuccessOverlay />
        <FailedOverlay onClose={() => {}} />
        <SendSuiTokenOverlay />
        <PayfricaPadiSuiOverlay />
        <EnterSuiAmountOverlay />
        <SendSuiToWAOverlay />
        <ReceiveMoneyOverlay />
        <ReceiveCardOverlay />
        <ConvertOverlay />
        {/* <ConfirmConvertOverlay />  */}
        <DepositTypeOverlay />
        <QuickTransfer />
        <ConfirmDepositOverlay />
        <MakeDepositOverlay />
        <EnterWithdrawAmount />
        <ConfirmWithdrawOverlay />
        <WithdrawingOverlay />
        <CardOverlay />
        <ConfirmCardCreate />
        <ScanCode />
        <ReceiveFundsFlowOverlay />
        <SendFundsFlowOverlay />
      </Suspense>
    </>
    // </AuthGuard>
  );
}
