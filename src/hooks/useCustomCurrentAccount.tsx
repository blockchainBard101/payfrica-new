import { useEffect, useState } from "react";

export const useCustomCurrentAccount = (key?: string) => {
  const [wallet, setWallet] = useState<string>("");

  const setCurrentAccount = (newWallet: string) => {
    console.log({ wallet: newWallet, type: typeof newWallet });
    if (!Object.keys(newWallet).length) return;

    localStorage.setItem("custom-wallet", JSON.stringify(newWallet));
    setWallet(newWallet);
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem("custom-wallet");

    if (storedWallet) {
      setWallet(JSON.parse(storedWallet));
    }
  }, [key]);

  return { setCurrentAccount, wallet };
};
