import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { Transaction } from '@mysten/sui/transactions';
import { client } from '@/config/suiClient';
import clientConfig from '@/config/clientConfig';
import { useCustomWallet } from '@/contexts/CustomWallet';
import { getNsAddress } from './registerNsName';
import { getObject } from './suiRpc';

export interface Pool {
  coinBalance: number;
  id: string;
  coinType: string;
  coinName: string;
  coinDecimal: number;
  ratesDollar: number;
}

function convertNsNameToSui(nsName: string): string {
  const [userPart, domainPart] = nsName.split('@').map(s => s.trim());
  if (!domainPart) throw new Error(`Invalid NS name "${nsName}"`);
  return `${userPart || domainPart}.${domainPart}.sui`;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
});

export function usePools() {
  const { data, error } = useSWR<Pool[]>(`${API_BASE}/pools`, fetcher);
  const pools = useMemo(() => data ?? [], [data]);
  const poolMap = useMemo(() => new Map(pools.map(p => [p.coinType, p])), [pools]);
  return { pools, poolMap, isLoading: !data && !error, error };
}

export function useUserDetails(address?: string) {
  const { data, error } = useSWR(
    address ? `${API_BASE}/users/${address}` : null,
    fetcher
  );
  return { details: data, isLoading: !data && !error, error };
}

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** On-chain token conversion and transfer hook */
export function useTokenExchange() {
  const { address, sponsorAndExecuteTransactionBlock } = useCustomWallet();
  const { pools, poolMap } = usePools();
  const { details: userDetails } = useUserDetails(address);

  const toMinimalUnits = useCallback((amount: number, decimals: number) => {
    return BigInt(Math.floor(amount * 10 ** decimals));
  }, []);

  const handleMergeSplit = useCallback((tx: Transaction, coinObjects: any[], amount: bigint) => {
    if (!coinObjects.length) throw new Error('No coins');
    const primary = coinObjects[0].coinObjectId;
    if (coinObjects.length > 1) {
      tx.mergeCoins(
        tx.object(primary),
        coinObjects.slice(1).map(c => tx.object(c.coinObjectId))
      );
    }
    const [split] = tx.splitCoins(primary, [amount]);
    return split;
  }, []);

  const getConversionRate = useCallback((from: string, to: string) => {
    const a = poolMap.get(from);
    const b = poolMap.get(to);
    if (!a || !b) throw new Error(`Unknown tokens: ${from}/${to}`);
    return b.ratesDollar / a.ratesDollar;
  }, [poolMap]);

  const handleConvert = useCallback(async (from: string, to: string, amount: number) => {
    if (!address) throw new Error('No wallet');
    const a = poolMap.get(from)!;
    const b = poolMap.get(to)!;
    const rate = getConversionRate(from, to);
    const amt = toMinimalUnits(amount, a.coinDecimal);
    const scaled = toMinimalUnits(rate, a.coinDecimal);
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType: a.coinType });
    const coinArg = handleMergeSplit(tx, coins.data, amt);
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::pool::convert_a_to_b`,
      typeArguments: [a.coinType, b.coinType],
      arguments: [
        tx.object(a.id),
        tx.object(b.id),
        coinArg,
        tx.pure.u64(scaled),
        tx.pure.u8(a.coinDecimal)
      ],
    });
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [address],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, getConversionRate, toMinimalUnits, handleMergeSplit]);

  const handleAddtoLiquidity = useCallback(async (coinType: string, amount: number) => {
    if (!address) throw new Error('No wallet');
    const a = poolMap.get(coinType)!;
    console.log(coinType);
    const amt = toMinimalUnits(amount, a.coinDecimal);
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType: a.coinType });
    const coinArg = handleMergeSplit(tx, coins.data, amt);

    const liqObj = await getObject(address, `${clientConfig.PACKAGE_ID}::pool::PayfricaPoolTicket`);
    if (liqObj === null) {
      tx.moveCall({
        target: `${clientConfig.PACKAGE_ID}::pool::add_liquidity_new`,
        typeArguments: [a.coinType],
        arguments: [
          tx.object(a.id),
          tx.object(clientConfig.PAYFRICA_POOL_ID),
          coinArg,
        ],
      });
    } else {
      tx.moveCall({
        target: `${clientConfig.PACKAGE_ID}::pool::add_liquidity`,
        typeArguments: [a.coinType],
        arguments: [
          tx.object(a.id),
          tx.object(clientConfig.PAYFRICA_POOL_ID),
          tx.object(liqObj),
          coinArg,
        ],
      });
    }
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [address],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, toMinimalUnits, handleMergeSplit]);

  const handleRemoveLiquidity = useCallback(async (coinType: string, amount: number) => {
    if (!address) throw new Error('No wallet');
    const a = poolMap.get(coinType)!;
    const amt = toMinimalUnits(amount, a.coinDecimal);
    const tx = new Transaction();

    const liqObj = await getObject(address, `${clientConfig.PACKAGE_ID}::pool::PayfricaPoolTicket`);
    if (liqObj === null) {
      throw new Error('No liquidity');
    }
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::pool::remove_liquidity`,
      typeArguments: [a.coinType],
      arguments: [
        tx.object(a.id),
        tx.object(liqObj),
        tx.pure.u64(amt),
      ],
    });
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [address],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, toMinimalUnits]);

  const handleWithdrawalRequest = useCallback(async (coinType: string, amount: number, agent: string) => {
    if (!address) throw new Error('No wallet');
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType });
    // const t = poolMap.get(coinType)!;
    // console.log(agent)
    const coinArg = handleMergeSplit(tx, coins.data, BigInt(amount));
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::agents::withdrawal_request`,
      typeArguments: [coinType],
      arguments: [
        tx.object(clientConfig.PAYFRICA_AGENT_ID),
        tx.object(agent),
        coinArg,
        tx.object('0x6'),
      ],
    });
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [address],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, sponsorAndExecuteTransactionBlock, handleMergeSplit]);

  const handleDepositRequest = useCallback(async (
    agent: string,
    amount: number,
    comment: string,
    coinType: string
  ) => {
    if (!address) throw new Error('No wallet');
    const tx = new Transaction();
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::agents::deposit_requests`,
      typeArguments: [coinType],
      arguments: [
        tx.object(clientConfig.PAYFRICA_AGENT_ID),
        tx.object(agent),
        tx.pure.u64(amount),
        tx.pure.string(comment),
        tx.object('0x6'),
      ],
    });
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [address],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, sponsorAndExecuteTransactionBlock]);

  const handleCreateCard = useCallback(async (
    card_address: string,
    name: string,
    expiration_date: number,
    hp: string,
    s: string,
    blobId: string,
    blobObjectId: string,
    blobUrl: string,
  ) => {
    if (!address) throw new Error('No wallet');
    const payfObj = await getObject(address, `${clientConfig.PACKAGE_ID}::payfrica::PayfricaUser`);
    if (payfObj === null) {
      throw new Error('Not Payfrica User');
    }
    const tx = new Transaction();
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::temporary_card::create_card`,
      arguments: [
        tx.object(clientConfig.PAYFRICA_TEMP_CARD_ID),
        tx.object(payfObj),
        tx.pure.address(card_address),
        tx.pure.string(name),
        tx.pure.u64(expiration_date),
        tx.pure.string(hp),
        tx.pure.string(s),
        tx.pure.string(blobId),
        tx.pure.address(blobObjectId),
        tx.pure.string(blobUrl),
        tx.object('0x6'),
      ],
    });
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [address],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, sponsorAndExecuteTransactionBlock]);

  const sendToAddress = useCallback(async (
    coinType: string,
    amount: number,
    recipient: string
  ) => {
    if (!address) throw new Error('No wallet');
    const t = poolMap.get(coinType)!;
    const amt = toMinimalUnits(amount, t.coinDecimal);
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType: t.coinType });
    const coinArg = handleMergeSplit(tx, coins.data, amt);
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::send::send_coin_address`,
      typeArguments: [t.coinType],
      arguments: [coinArg, tx.pure.address(recipient), tx.object('0x6')]
    });
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [recipient],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, toMinimalUnits, handleMergeSplit]);

  const sendToNameService = useCallback(async (
    coinType: string,
    amount: number,
    ns: string
  ) => {
    if (!address) throw new Error('No wallet');
    const t = poolMap.get(coinType)!;
    const amt = toMinimalUnits(amount, t.coinDecimal);
    const tx = new Transaction();
    const coins = await client.getCoins({ owner: address, coinType: t.coinType });
    const coinArg = handleMergeSplit(tx, coins.data, amt);
    const obj = await getNsAddress(ns);
    const formatted = convertNsNameToSui(ns);
    tx.moveCall({
      target: `${clientConfig.PACKAGE_ID}::send::send_ns`,
      typeArguments: [t.coinType],
      arguments: [
        coinArg,
        tx.object(clientConfig.NS_REGISTRY_ID),
        tx.pure.string(formatted),
        tx.object('0x6')
      ],
    });
    return sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [obj],
      options: { showEffects: true, showObjectChanges: true, showEvents: true }
    });
  }, [address, poolMap, sponsorAndExecuteTransactionBlock, toMinimalUnits, handleMergeSplit]);

  const getBalance = useCallback(async (coinType: string) => {
    if (!address) throw new Error('No wallet');
    const t = poolMap.get(coinType)!;
    const r = await client.getBalance({ owner: address, coinType: t.coinType });
    return formatter.format(Number(r.totalBalance) / 10 ** t.coinDecimal);
  }, [address, poolMap]);


  const getAllPools = useCallback(async () => {
    if (!address) throw new Error('No wallet connected');
    console.log("fetching pools");
    const result = await Promise.all(
      Array.from(poolMap.values()).map(async pool => {
        const balanceRaw = await client.getBalance({ owner: address, coinType: pool.coinType });
        // console.log(balanceRaw);
        const balance = Number(balanceRaw.totalBalance) / 10 ** pool.coinDecimal;
        // console.log("Balance", balance);
        return {
          coinType: pool.coinType,
          symbol: pool.coinName,
          id: pool.id,
          balance,
          coinBalance: pool.coinBalance / 10 ** pool.coinDecimal,
          coinName: pool.coinName,
          formatted: formatter.format(balance)
        };
      })
    );
    // console.log(result);
    return result;
  }, [address, poolMap]);

  const getBaseBalance = useCallback(async () => {
    if (!address) throw new Error('No wallet');
    if (!userDetails) return;
    const baseType = userDetails.country.baseTokencoinType;
    const token = poolMap.get(baseType);
    if (!token) {
      console.warn("No pool found for baseType:", baseType);
      return "0.00";
    }
    const r = await client.getBalance({ owner: address, coinType: token.coinType });
    return `${userDetails.country.currencySymbol}${formatter.format(
      Number(r.totalBalance) / 10 ** token.coinDecimal
    )}`;
  }, [address, poolMap, userDetails]);

  const getPortfolio = useCallback(async () => {
    if (!address) throw new Error('No wallet connected');
    const poolsArr = Array.from(poolMap.values());
    const local = poolsArr.find(p => p.coinType === userDetails.country.baseTokencoinType);
    const localRate = local?.ratesDollar ?? 0;
    const breakdown = await Promise.all(
      poolsArr.map(async t => {
        const balStr = await getBalance(t.coinType);
        const balance = parseFloat(balStr.replace(/,/g, ''));
        return {
          symbol: t.coinName,
          balance,
          usdValue: balance / t.ratesDollar
        };
      })
    );
    const totalUSD = breakdown.reduce((sum, b) => sum + b.usdValue, 0);
    const totalLocal = (totalUSD || 0) * localRate;

    return {
      breakdown,
      totalUSD,
      totalLocal: `${userDetails?.country.currencySymbol ?? ""}${formatter.format(totalLocal)}`
    };
  }, [address, poolMap, userDetails, getBalance]);

  return {
    handleConvert,
    handleDepositRequest,
    sendToAddress,
    handleCreateCard,
    sendToNameService,
    getBalance,
    getBaseBalance,
    getAllPools,
    getPortfolio,
    handleWithdrawalRequest,
    handleAddtoLiquidity,
    handleRemoveLiquidity
  };
}
