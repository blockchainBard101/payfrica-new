// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import {
//   useConnectWallet,
//   useCurrentAccount,
//   useWallets,
// } from "@mysten/dapp-kit";
// import { isEnokiWallet, EnokiWallet, AuthProvider } from "@mysten/enoki";
// import { socialLogins } from "@/config/constants";

// function LoginPage() {
//   const router = useRouter();
//   const { mutateAsync: connect, mutate, ...p } = useConnectWallet();
//   const [isLoading, setIsLoading] = useState(false);

//   const wallets = useWallets().filter(isEnokiWallet);
//   const walletsByProvider = wallets.reduce(
//     (map, wallet) => map.set(wallet.provider, wallet),
//     new Map<AuthProvider, EnokiWallet>()
//   );

//   //If the user is already logged in redirect to the dashboard page
//   //useEffect(() => {
//   //  if (wallet) {
//   //    router.push("/dashboard");
//   //  }
//   //}, [wallet]);

//   return (
//     <div className="login-page-container flex">
//       {/* Left-side image */}
//       <div className="image-container relative flex-1">
//         <Image
//           src={"/LoginFeaturedImage.png"}
//           alt="Payfrica Featured"
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       {/* Right-side login box */}
//       <div className="login-container flex-1 flex items-center justify-center p-8">
//         <div className="login-box bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
//           <h2 className="login-title text-2xl font-semibold mb-6 text-center">
//             Login
//           </h2>

//           {isLoading ? (
//             <div className="flex flex-col items-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-transparent mb-4"></div>
//               <p>Signing you in…</p>
//             </div>
//           ) : (
//             socialLogins.map(({ label, icon, provider }) => {
//               const wallet = walletsByProvider.get(provider as AuthProvider);
//               return (
//                 <button
//                   key={label}
//                   className="login-button w-full flex items-center justify-center mb-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//                   onClick={async () => {
//                     setIsLoading(true);
//                     try {
//                       const res = await connect({ wallet });
//                       //
//                       //                      if (res?.accounts[0]) {
//                       //                        const newWallet = res?.accounts[0]?.address;
//                       //
//                       //                        setCurrentAccount(newWallet);
//                       //                        router.push("/dashboard");
//                       //                      }
//                       //await connect({ wallet });

//                       mutate(
//                         { wallet },
//                         {
//                           onSuccess: (res) => {
//                             router.push("/dashboard");
//                           },
//                         }
//                       );
//                     } catch (error) {
//                       console.error("Login failed:", error);
//                       // you may want to show an error toast here
//                       setIsLoading(false);
//                     }
//                   }}
//                 >
//                   <Image
//                     src={icon}
//                     alt={label}
//                     width={24}
//                     height={24}
//                     className="mr-2"
//                   />
//                   Sign in with {label}
//                 </button>
//               );
//             })
//           )}

//           <p className="footer text-center text-sm text-gray-500 mt-6">
//             &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export { LoginPage };

// app/login/page.tsx or wherever your LoginPage is defined
"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import { isEnokiWallet, EnokiWallet, AuthProvider } from "@mysten/enoki";
import { socialLogins } from "@/config/constants";
import Page from "@/app/dashboard/page";

function LoginPage() {
  const { mutateAsync: connect, mutate } = useConnectWallet();
  const [isLoading, setIsLoading] = useState(false);
  const currentAccount = useCurrentAccount(); // Detect login status

  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>()
  );

  // ✅ If user is logged in, render the dashboard inline
  if (currentAccount) {
    // console.log(currentAccount.address)
    return <Page />;
  }

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
              return (
                <button
                  key={label}
                  className="login-button w-full flex items-center justify-center mb-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      mutate(
                        { wallet },
                        {
                          onSuccess: () => {
                            // no need to redirect anymore
                          },
                        }
                      );
                    } catch (error) {
                      console.error("Login failed:", error);
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

export { LoginPage };
