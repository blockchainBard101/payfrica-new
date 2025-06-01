"use client";

import React, { FC, ReactNode, useEffect } from "react";
import LogoLoader from "./LogoLoader";
import { useQuery } from "@tanstack/react-query";
import { useCurrentAccount } from "@mysten/dapp-kit";
import axios from "axios";
import { useRouter } from "next/navigation";
//import { LoginPage } from "./login-component";

const fetcher = async (addr?: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${addr}/basic`
  );

  return res.data;
};

export const AuthGuard: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const currentAccount = useCurrentAccount();
  const r = useRouter();

  console.log({ currentAccountAddr: currentAccount?.address });

  const { isLoading, error, data } = useQuery({
    queryKey: ["create-user", currentAccount?.address],
    queryFn: () => fetcher(currentAccount?.address),
    enabled: Boolean(currentAccount?.address),
  });

  //If the component is still loading, show this loader
  if (isLoading) {
    return (
      <div className="overlay-background">
        <LogoLoader />
      </div>
    );
  }

  //When there is an issue show this UI
  if (error) {
    return (
      <div className="overlay-background flex items-center justify-center">
        <p className="text-red-600 bg-white p-4 rounded">
          Error loading profile: {error.message}
        </p>
      </div>
    );
  }

  console.log({ currentAccount });

  //  useEffect(() => {
  //    if (!currentAccount?.address) {
  //      r.push("/login");
  //      return;
  //    }
  //
  //    if (error && !data) {
  //      r.push("/login");
  //    }
  //  }, [currentAccount?.address, data, error, r]);

  return <div className={className}>{children}</div>;
};
