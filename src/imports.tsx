// Imports for the login page
// ✅ This works during both dev and build
export { default as GoogleIcon } from '@/Assets/Images/GoogleLogo.png';
export { default as FacebookIcon } from '@/Assets/Images/FacebookLogo.png';
export { default as TwitchIcon } from '@/Assets/Images/TwitchLogo.png';
export { default as MicrosoftIcon } from '@/Assets/Images/MicrosoftLogo.png';
export { default as LoginFeaturedImage } from '@/Assets/Images/LoginFeaturedImage.png';

// Imports for the Dashboard page
import Navigation from '@/components/Navigations';
import PayfricaNavLogo from '@/Assets/Images/PayfricaNavLogo.png';
import BalancesBg from '@/Assets/Images/BalancesBg.png';
import Balances from './components/Balances';
import QuickActions from './components/QuickActions';
import SavingsCircle from './components/SavingsCircle';
import TransactionHistory from './components/TransactionHistory';
// Imports for the Send Money Overlay
import SendMoneyOverlay from './components/SendMoneyOverlay';
import PayfricaPadiOverlay from './components/PayfricaPadiOverlay';
import EnterAmountOverlay from './components/EnterAmountOverlay';
import ProfileDP from '@/Assets/Images/Profile DP.jpg';
import SendingOverlay from './components/SendingOverlay';
import FeedbackOverlay from './components/FeedbackOverlay';
import SuccessOverlay from './components/SuccessOverlay';
import FailedOverlay from './components/FailedOverlay';
import SendSuiTokenOverlay from './components/SendSuiTokenOverlay';
import PayfricaPadiSuiOverlay from './components/PayfricaPadiSuiOverlay';
import EnterSuiAmountOverlay from './components/EnterSuiAmountOverlay';
import SendSuiToWAOverlay from './components/SendSuiToWAOverlay';
import Loading from './components/Loading';

// Imports for the Receive Money Overlay
import ReceiveMoneyOverlay from './components/ReceiveMoneyOverlay';
import ReceiveCardOverlay from './components/ReceiveCardOverlay';
import PayfricaCardBg from '@/Assets/Images/PayfricaCardBg.png';

// Imports for Converts
import ConvertOverlay from './components/ConvertOverlay';
import ConfirmConvertOverlay from './components/ConfirmConvertOverlay';
import SuiLogo from '@/Assets/Images/SuiLogo.png';

// Imports for Layout
import { GlobalStateProvider } from '@/GlobalStateProvider';

export {
    Loading,
    Navigation,
    PayfricaNavLogo,
    BalancesBg,
    Balances,
    QuickActions,
    SavingsCircle,
    TransactionHistory,
    GlobalStateProvider,
    SendMoneyOverlay,
    PayfricaPadiOverlay,
    EnterAmountOverlay,
    ProfileDP,
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
    PayfricaCardBg,
    ConvertOverlay,
    ConfirmConvertOverlay,
    SuiLogo
  };
  