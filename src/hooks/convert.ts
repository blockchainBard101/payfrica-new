// src/hooks/useConverter.ts
import { Transaction } from "@mysten/sui/transactions";
import { client } from "@/config/suiClient";
import clientConfig from "@/config/clientConfig";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";

const tokens = {
  NGNC: {
    CoinId: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::ngnc::NGNC",
    PoolId: "0x5d3cb4beb22f251e54de9580b6530ebbad115f92fd0bccec5190c38f14591684",
    decimals: 6,
  },
  GHSC: {
    CoinId: "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ghsc::GHSC",
    PoolId: "0xDDD…444",
    decimals: 6,
  },
  USDC: {
    CoinId: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::usdc::USDC",
    PoolId: "0xaae9216964bf12c862ab72c3331490bde1f6afbc5d1f48056496d381803b48ad",    // ← your USDC pool object ID here
    decimals: 6,
  },
  KHSC: {
    CoinId: "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::khsc::KHSC",
    PoolId: "0xDDD…444",    // ← your KHSC pool object ID here
    decimals: 6,
  },
} as const;

const rates_dollar: Record<keyof typeof tokens, number> = {
  NGNC: 1500,   // 1500 NGNC per USDC
  GHSC: 15.56,  // 15.56 GHSC per USDC
  USDC: 1,      // 1 USDC per USDC
  KHSC: 15.56,  // 15.56 KHSC per USDC
};

/**
 * Returns how many B‑tokens you get for 1 A‑token,
 * given rates_dollar[X] = “tokens of X per 1 USDC”.
 */
function getConversionRate<
  A extends keyof typeof tokens,
  B extends keyof typeof tokens
>(tokenA: A, tokenB: B): number {
  return rates_dollar[tokenB] / rates_dollar[tokenA];
}

/**
 * Hook exposing a `handleConvert` function to swap A→B.
 */
export function useConverter() {
  const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();

  async function handleConvert<
    A extends keyof typeof tokens,
    B extends keyof typeof tokens
  >(
    tokenA: A,
    tokenB: B,
    amount: number
  ): Promise<SuiTransactionBlockResponse> {
    if (!address) throw new Error("Wallet not connected");
    
    // --- Lookup IDs & decimals ---
    const { CoinId: tokenAId, PoolId: poolA, decimals: decA } = tokens[tokenA];
    const { CoinId: tokenBId } = tokens[tokenB];
    
    // --- Compute & scale rate ---
    const rawRate = getConversionRate(tokenA, tokenB);
    const scaledRate = Math.floor(rawRate * 10 ** decA); // u64
    console.log(scaledRate, rawRate)
    // --- Convert human amount to minimal units ---
    const amt = BigInt(Math.floor(amount * 10 ** decA));

    // --- Build the transaction ---
    const txb = new Transaction();

    // 1) Grab one coin to split
    const coins = await client.getCoins({
      owner: address,
      coinType: tokenAId,
    });
    if (coins.data.length === 0) {
      throw new Error(`No ${tokenA} coins found in wallet`);
    }
    const [coin] = txb.splitCoins(coins.data[0].coinObjectId, [amt]);

    // 2) Call the pool’s convert function
    txb.moveCall({
      target: `${clientConfig.PACKAGE_ID}::pool_new::convert_a_to_b`,
      typeArguments: [tokenAId, tokenBId],
      arguments: [
        txb.object(poolA),
        txb.object(tokens[tokenB].PoolId),
        coin,
        txb.pure.u64(scaledRate),
        txb.pure.u8(decA),
      ],
    });

    // --- Send it ---
    return sponsorAndExecuteTransactionBlock({
      tx: txb,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [address],
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      },
    });
  }

  return { handleConvert };
}
