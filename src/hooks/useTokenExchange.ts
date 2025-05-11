// src/hooks/useApiHooks.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { client } from '@/config/suiClient';
import clientConfig from '@/config/clientConfig';
import { useCustomWallet } from '@/contexts/CustomWallet';
import { SuiTransactionBlockResponse } from '@mysten/sui/client';
import { getNsAddress } from './registerNsName';

// Local Pool type matching your backend response
export interface Pool {
  id: string;
  coinType: string;
  coinName: string;
  coinDecimal: number;
  ratesDollar: number;
}

function convertNsNameToSui(nsName: string): string {
  const atIndex = nsName.indexOf('@');
  if (atIndex === -1) {
    throw new Error(`Invalid NS name "${nsName}". Expected "user@domain".`);
  }
  const userPart = nsName.substring(0, atIndex).trim();
  const domainPart = nsName.substring(atIndex + 1).trim();
  if (!domainPart) {
    throw new Error(`Invalid NS name "${nsName}". Domain missing.`);
  }
  return userPart ? `${userPart}.${domainPart}.sui` : `${domainPart}.sui`;
}

// Base API URL for all endpoints
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/** Fetch list of pools (tokens) from backend */
export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/pools`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setPools(await res.json());
      } catch (e) {
        console.error('usePools error', e);
      }
    })();
  }, []);
  const poolMap = useMemo(() => new Map(pools.map(p => [p.coinType, p])), [pools]);
  return { pools, poolMap };
}

/** Fetch user details (including base token name & symbol) */
export function useUserDetails(address?: string) {
  const [details, setDetails] = useState<any>(null);
  useEffect(() => {
    if (!address) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${address}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setDetails(await res.json());
      } catch (e) {
        console.error('useUserDetails error', e);
      }
    })();
  }, [address]);
  return details;
}

const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** On-chain token conversion and transfer hook */
export function useTokenExchange() {
  const { address, sponsorAndExecuteTransactionBlock } = useCustomWallet();
  const userDetails = useUserDetails(address);
  const { poolMap } = usePools();

  const toMinimalUnits = useCallback((amount: number, decimals: number) => BigInt(Math.floor(amount * 10 ** decimals)), []);

  const handleMergeSplit = useCallback((tx: Transaction, coinObjects: any[], amount: bigint) => {
    if (!coinObjects.length) throw new Error('No coins');
    let primary = coinObjects[0].coinObjectId;
    if (coinObjects.length > 1) {
      const rest = coinObjects.slice(1).map(c => c.coinObjectId);
      tx.mergeCoins(tx.object(primary), rest.map(id => tx.object(id)));
    }
    const [split] = tx.splitCoins(primary, [amount]);
    return split;
  }, []);

  const getConversionRate = useCallback((from: string, to: string) => {
    const a = poolMap.get(from), b = poolMap.get(to);
    if (!a || !b) throw new Error(`Unknown tokens: ${from}/${to}`);
    return b.ratesDollar / a.ratesDollar;
  }, [poolMap]);

  const handleConvert = useCallback(async (from: string, to: string, amount: number) => {
    if (!address) throw new Error('No wallet');
    const a = poolMap.get(from)!, b = poolMap.get(to)!;
    const rate = getConversionRate(from, to);
    const amt = toMinimalUnits(amount, a.coinDecimal), scaled = toMinimalUnits(rate, a.coinDecimal);
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType: a.coinType });
    const c = handleMergeSplit(tx, coins.data, amt);
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::pool::convert_a_to_b`,
      typeArguments: [a.coinType, b.coinType],
      arguments: [tx.object(a.id), tx.object(b.id), c, tx.pure.u64(scaled), tx.pure.u8(a.coinDecimal)],
    });
    return sponsorAndExecuteTransactionBlock({
      tx, network: clientConfig.SUI_NETWORK_NAME, includesTransferTx: true,
      allowedAddresses: [address], options: { showEffects:true, showObjectChanges:true, showEvents:true }
    });
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, getConversionRate, toMinimalUnits, handleMergeSplit]);

  const handleDepositRequest = useCallback(async (agent: string, amount: number, comment: string, coinType: string) => {
    if (!address) throw new Error('No wallet');
    const tx = new Transaction();
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::agents::deposit_requests`,
      typeArguments: [coinType],
      arguments: [tx.object(clientConfig.PAYFRICA_AGENT_ID), tx.object(agent), tx.pure.u64(amount), tx.pure.string(comment), tx.object("0x6")],
    });
    return sponsorAndExecuteTransactionBlock({
      tx, network: clientConfig.SUI_NETWORK_NAME, includesTransferTx: true,
      allowedAddresses: [address], options: { showEffects:true, showObjectChanges:true, showEvents:true }
    });
  }, [address, sponsorAndExecuteTransactionBlock]);

  const sendToAddress = useCallback(async (coinType: string, amount: number, recipient: string) => {
    if (!address) throw new Error('No wallet');
    const t = poolMap.get(coinType)!;
    const amt = toMinimalUnits(amount, t.coinDecimal);
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType: t.coinType });
    const c = handleMergeSplit(tx, coins.data, amt);
    tx.moveCall({ target:`${clientConfig.PACKAGE_ID}::send::send_coin_address`, typeArguments:[t.coinType], arguments:[c, tx.pure.address(recipient), tx.object("0x6")] });
    return sponsorAndExecuteTransactionBlock({
      tx, network: clientConfig.SUI_NETWORK_NAME, includesTransferTx:true,
      allowedAddresses:[recipient], options:{ showEffects:true, showObjectChanges:true, showEvents:true }
    });
    // return Boolean(r);
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, toMinimalUnits, handleMergeSplit]);

  const sendToNameService = useCallback(async (coinType:string, amount:number, ns:string) => {
    if (!address) throw new Error('No wallet');
    const t = poolMap.get(coinType)!;
    const amt = toMinimalUnits(amount, t.coinDecimal);
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType: t.coinType });
    const c = handleMergeSplit(tx, coins.data, amt);
    const obj = await getNsAddress(ns), formatted=convertNsNameToSui(ns);
    tx.moveCall({ target:`${clientConfig.PACKAGE_ID}::send::send_ns`, typeArguments:[t.coinType], arguments:[c, tx.object("0x300369e8909b9a6464da265b9a5a9ab6fe2158a040e84e808628cde7a07ee5a3"), tx.pure.string(formatted), tx.object("0x6")] });
    return sponsorAndExecuteTransactionBlock({
      tx, network: clientConfig.SUI_NETWORK_NAME, includesTransferTx:true,
      allowedAddresses:[obj], options:{ showEffects:true, showObjectChanges:true, showEvents:true }
    });
    // return Boolean(r);
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, toMinimalUnits, handleMergeSplit]);

  const getBalance = useCallback(async (coinType:string) => {
    if (!address) throw new Error('No wallet');
    const t = poolMap.get(coinType)!;
    // console.log(t);
    const r = await client.getBalance({ owner:address, coinType:t.coinType });
    // console.log(r);
    const v=Number(r.totalBalance)/10**t.coinDecimal;
    return formatter.format(v);
  }, [address,poolMap]);

  const getBaseBalance = useCallback(async () => {
    if (!address) throw new Error('No wallet');
    if (!userDetails) throw new Error('No user details');
    // console.log(userDetails);
    const token = poolMap.get(userDetails.country.baseTokencoinType);
    // console.log(token);
    if (!token) throw new Error(`Unknown base token: ${userDetails.country.baseTokencoinType}`);
    const r = await client.getBalance({ owner:address, coinType:token.coinType });
    // console.log(r);
    const val=Number(r.totalBalance)/10**token.coinDecimal;
    // console.log(val);
    return `${userDetails.country.currencySymbol}${formatter.format(val)}`;
  }, [address, poolMap, userDetails]);

  const getPortfolio = useCallback(async () => {
    if (!address) {
      throw new Error('No wallet connected');
    }
  
    // 1. Pull out your pools into an array
    const pools = Array.from(poolMap.values());
  
    // 2. Figure out your local conversion rate once
    const localPool = pools.find(
      (t) => t.coinType === userDetails.country.baseTokencoinType
    );
    const localConversionRate = localPool?.ratesDollar ?? 0;
  
    // 3. Fetch balances in parallel
    const breakdown = await Promise.all(
      pools.map(async (t) => {
        const balStr = await getBalance(t.coinType);
        const balance = parseFloat(balStr.replace(/,/g, ''));
        const usdValue = balance / t.ratesDollar;
        // console.log(usdValue);
        return {
          symbol: t.coinName,
          balance,
          usdValue,
        };
      })
    );
    
    // 4. Aggregate totals with pure reduces
    const totalUSD = breakdown.reduce((sum, { usdValue }) => sum + usdValue, 0);
    // console.log(totalUSD);
    const totalLocal = totalUSD * localConversionRate;
  
    // 5. Format local total
    const formattedLocal = `${userDetails.country.currencySymbol}${formatter.format(
      totalLocal
    )}`;
  
    return { breakdown, totalUSD, totalLocal: formattedLocal };
  }, [address, poolMap, userDetails, getBalance]);  

  return { handleConvert, sendToAddress, sendToNameService, getBalance, getBaseBalance, getPortfolio, handleDepositRequest };
}