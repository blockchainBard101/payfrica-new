"use client";
import Image from "next/image";
import { LoginFeaturedImage, GoogleIcon, FacebookIcon, TwitchIcon, MicrosoftIcon } from "@/imports"; // Replace with actual image path
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
    const router = useRouter();
  const { isConnected, logout, redirectToAuthUrl, emailAddress, address } =
    useCustomWallet();
    // const isConnected = true;
    if (isConnected) {
      router.push("/dashboard");
      return null;
    }
    return (
        <div className="login-page-container">
            <div className="image-container">
                <Image src={LoginFeaturedImage} className="login-featured-image" alt="Payfrica Featured Image" layout="fill" objectFit="cover" priority />
            </div>
            <div className="login-container">
                <div className="login-box">
                    <h2 className="login-title">Login</h2>
                    <button className="login-button" onClick={redirectToAuthUrl}>
                        <img src={GoogleIcon.src} alt="Google" className="icon" />
                        Sign in with Google
                    </button>
                    <button className="login-button">
                        <img src={FacebookIcon.src} alt="Facebook" className="icon" />
                        Sign in with Facebook
                    </button>
                    <button className="login-button">
                        <img src={TwitchIcon.src} alt="Twitch" className="icon" />
                        Sign in with Twitch
                    </button>
                    <button className="login-button">
                        <img src={MicrosoftIcon.src} alt="Microsoft" className="icon" />
                        Sign in with Microsoft
                    </button>
                    <p className="footer"> &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED</p>
                </div>
            </div>
        </div>
    );
}
