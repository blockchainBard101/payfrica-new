import { useState, useEffect, useCallback } from 'react';
import { useTokenExchange } from './useTokenExchange';

export const useRealTimeBalances = (address: string) => {
  const [balances, setBalances] = useState({ fundingBalance: null as string | null, portfolioBalance: null as string | null });
  const { getBaseBalance, getPortfolio } = useTokenExchange();

  const updateBalances = useCallback(async () => {
    if (!address) return;
    try {
      const fundingBalance = await getBaseBalance();
      const { totalLocal } = await getPortfolio();
      // console.log({ fundingBalance, totalLocal });
      setBalances({ fundingBalance, portfolioBalance: totalLocal });
    } catch (e) {
      console.error('Error updating balances:', e);
    }
  }, [address, getBaseBalance, getPortfolio]);

  useEffect(() => {
    if (!address) return;
    updateBalances();
    const iv = setInterval(updateBalances, 10000);
    return () => clearInterval(iv);
  }, [address, updateBalances]);

  return balances;
};