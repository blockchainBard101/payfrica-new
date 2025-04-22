"use client";
import { Navigation, Balances, QuickActions, SavingsCircle, TransactionHistory, SendMoneyOverlay, PayfricaPadiOverlay, EnterAmountOverlay, SendingOverlay, FeedbackOverlay, SuccessOverlay, FailedOverlay, SendSuiTokenOverlay, PayfricaPadiSuiOverlay, EnterSuiAmountOverlay, SendSuiToWAOverlay, ReceiveMoneyOverlay, ReceiveCardOverlay, ConvertOverlay, ConfirmConvertOverlay } from '@/imports';
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const router = useRouter();
    const { isConnected, logout, redirectToAuthUrl, emailAddress, address } =
        useCustomWallet();
    if (!isConnected) {
        router.push("/login");
        return null;
    }
    return (
        <div>
            <Navigation />
            <Balances />
            <QuickActions />
            <SavingsCircle />
            <TransactionHistory />
            <SendMoneyOverlay />
            <PayfricaPadiOverlay />
            <EnterAmountOverlay />
            {/* Sending Overlay */}
            <SendingOverlay />
            <FeedbackOverlay />
            <SuccessOverlay />
            <FailedOverlay />
            <SendSuiTokenOverlay />
            <PayfricaPadiSuiOverlay />
            <EnterSuiAmountOverlay />
            <SendSuiToWAOverlay />
            {/* Receiving Overlay */}
            <ReceiveMoneyOverlay />
            <ReceiveCardOverlay />
            {/* Convert Overlay */}
            <ConvertOverlay />
            <ConfirmConvertOverlay />
        </div>
    )
}

export default Dashboard;