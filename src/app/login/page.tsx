"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import {
  isEnokiWallet,
  EnokiWallet,
  AuthProvider,
} from "@mysten/enoki";

import {
  LoginFeaturedImage,
  GoogleIcon,
  FacebookIcon,
  TwitchIcon,
  MicrosoftIcon,
} from "@/imports";


const socialLogins = [
  { label: "Google", icon: GoogleIcon, provider: "google" },
  { label: "Facebook", icon: FacebookIcon, provider: "facebook" },
  { label: "Twitch", icon: TwitchIcon, provider: "twitch" },
  { label: "Microsoft", icon: MicrosoftIcon, provider: "microsoft" },
];

export default function LoginPage() {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();

  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>()
  );

  useEffect(() => {
    if (currentAccount) {
      router.push("/dashboard");
    }
  }, [currentAccount, router]);

  if (currentAccount) return null;

  return (
    <div className="login-page-container">
      <div className="image-container">
        <Image
          src={LoginFeaturedImage}
          alt="Payfrica Featured"
          layout="fill"
          objectFit="cover"
          className="login-featured-image"
          priority
        />
      </div>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>

          {socialLogins.map(({ label, icon, provider }) => {
            const wallet = walletsByProvider.get(provider as AuthProvider);
            return wallet ? (
              <button
                key={label}
                className="login-button"
                onClick={() => connect({ wallet })}
              >
                <Image src={icon} alt={label} width={24} height={24} className="icon" />
                Sign in with {label}
              </button>
            ) : null;
          })}

          <p className="footer">
            &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </div>
  );
}
