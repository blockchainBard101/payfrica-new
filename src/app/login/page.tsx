// src/pages/login.tsx (or wherever your LoginPage lives)
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  useConnectWallet,
  useWallets,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { isEnokiWallet, EnokiWallet, AuthProvider } from "@mysten/enoki";
import { socialLogins } from "@/config/constants";
// import { useCustomWallet } from "@/contexts/CustomWallet";

export default function LoginPage() {
  const router = useRouter();
  // const { isConnected } = useCustomWallet();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connect } = useConnectWallet();
  const [isLoading, setIsLoading] = useState(false);

  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>()
  );

  // console.log(currentAccount);

  useEffect(() => {
    if (currentAccount) {
      router.push("/dashboard");
    }
  }, [currentAccount, router]);

  if (currentAccount) return null;

  return (
    <div className="login-page-container flex">
      {/* Left-side image */}
      <div className="image-container relative flex-1">
        <Image
          src={"/LoginFeaturedImage.png"}
          alt="Payfrica Featured"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right-side login box */}
      <div className="login-container flex-1 flex items-center justify-center p-8">
        <div className="login-box bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h2 className="login-title text-2xl font-semibold mb-6 text-center">
            Login
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-transparent mb-4"></div>
              <p>Signing you in…</p>
            </div>
          ) : (
            socialLogins.map(({ label, icon, provider }) => {
              const wallet = walletsByProvider.get(provider as AuthProvider);
              if (!wallet) return null;
              return (
                <button
                  key={label}
                  className="login-button w-full flex items-center justify-center mb-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await connect({ wallet });
                    } catch (error) {
                      console.error("Login failed:", error);
                      // you may want to show an error toast here
                      setIsLoading(false);
                    }
                  }}
                >
                  <Image
                    src={icon}
                    alt={label}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  Sign in with {label}
                </button>
              );
            })
          )}

          <p className="footer text-center text-sm text-gray-500 mt-6">
            &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </div>
  );
}
