"use client";

import React, { FC, ReactNode, useEffect } from "react";
import LogoLoader from "./LogoLoader";
import { useQuery } from "@tanstack/react-query";
import { useCurrentAccount } from "@mysten/dapp-kit";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { isLoading, error, data } = useQuery({
    queryKey: ["create-user", currentAccount?.address],
    queryFn: () => fetcher(currentAccount?.address),
    enabled: Boolean(currentAccount?.address),
  });

  // useEffect(() => {
  //   if (!currentAccount?.address) {
  //     router.push("/login");
  //     return;
  //   }

  //   if (error && !data) {
  //     router.push("/login");
  //   }
  // }, [currentAccount?.address, data, error, router]);

  if (isLoading) {
    return (
      <div className="overlay-background">
        <LogoLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="overlay-background flex items-center justify-center">
        <p className="text-red-600 bg-white p-4 rounded">
          Error loading profile: {error.message}
        </p>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};
