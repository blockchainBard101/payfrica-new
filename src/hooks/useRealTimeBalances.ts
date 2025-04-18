// useRealTimeBalances.js
import { useState, useEffect, useCallback } from 'react';
import { getBasetokenBalance, getPortfolioValue } from '@/hooks/getBalances';
// Suppose you have another hook that retrieves token details
// import { getTokenBalances } from '@/hooks/getTokenBalances';

export const useRealTimeBalances = (address) => {
  const [balances, setBalances] = useState({
    fundingBalance: null,
    portfolioBalance: null,
    savingsBalance: null,
    cardBalance: null,
    tokenBalances: [],
  });
  // The function to update all balances; wrap with useCallback to avoid re-creation
  const updateBalances = useCallback(async () => {
    if (!address) return;
    try {
      // Fetch your balances asynchronously
      const fundingBalance = await getBasetokenBalance(address);
      const portfolioBalance = await getPortfolioValue(address);
      const pb = portfolioBalance.totalInUserCurrency;
      // const savingsBalance = await getSavingsBalance(address);
      // const cardBalance = await getCardBalance(address);
      // const tokenBalances = await getTokenBalances(address);
      
      setBalances((prev) => ({
        ...prev,
        fundingBalance,
        portfolioBalance: pb,
        // savingsBalance,
        // cardBalance,
        // tokenBalances,
      }));
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  }, [address]);

  // Set up polling using useEffect
  useEffect(() => {
    if (!address) return;
    // First update immediately
    updateBalances();
    const interval = setInterval(updateBalances, 10000); // adjust the interval (milliseconds) as needed
    return () => clearInterval(interval);
  }, [address, updateBalances]);

  return balances;
};
