import { client } from "@/config/suiClient";

const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const token_details = {
  NGNC: {
    CoinId: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::ngnc::NGNC",
    PoolId: "",
    decimals: 6,
  },
  GHSC: {
    CoinId: "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ghsc::GHSC",
    PoolId: "",
    decimals: 6,
  },
  USDC: {
    CoinId: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::usdc::USDC",
    PoolId: "",
    decimals: 6,
  },
  KHSC: {
    CoinId: "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ghsc::GHSC",
    PoolId: "",
    decimals: 6,
  },
} as const;

const rates_dollar: Record<keyof typeof token_details, number> = {
  NGNC: 1500,
  GHSC: 15.56,
  USDC: 1,
  KHSC: 15.56
};

const user_details = {
  Currency: "NGNC" as keyof typeof token_details,
  BaseToken: {
    token:
      "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::ngnc::NGNC",
    decimals: 6,
  },
  Symbol: "₦",
};

/** Fetch raw on‑chain balance for a given token symbol */
async function fetchTokenBalance(
  owner: string,
  symbol: keyof typeof token_details
): Promise<number> {
  const { CoinId, decimals } = token_details[symbol];
  const resp = await client.getBalance({ owner, coinType: CoinId });
  return Number(resp.totalBalance) / 10 ** decimals;
}

/** 
 * Returns a breakdown of each token’s balance and USD value,
 * plus total USD and total in user’s currency. 
 */
export async function getPortfolioValue(owner: string) {
  // 1. Filter out tokens with no CoinId
  const symbols = (Object.keys(token_details) as Array<keyof typeof token_details>)
    .filter((s) => token_details[s].CoinId);

  // 2. Fetch balances in parallel
  const balances = await Promise.all(
    symbols.map(async (symbol) => {
      const balance = await fetchTokenBalance(owner, symbol);
      const usdValue = balance * (rates_dollar[symbol] ?? 0);
      return { symbol, balance, usdValue };
    })
  );  
  // console.log(balances);

  // 3. Sum USD values
  const totalUSD = balances.reduce((sum, t) => sum + t.usdValue, 0);
  // console.log(totalUSD);
  // 4. Convert USD total to user currency
  const userRate = rates_dollar[user_details.Currency];
  const totalInUserCurrency = totalUSD / userRate;
//   console.log(`${user_details.Symbol}${totalInUserCurrency.toFixed(2)}`)
  return {
    breakdown: balances,
    totalUSD: totalUSD.toFixed(2),
    totalInUserCurrency: `${user_details.Symbol}${formatter.format(totalInUserCurrency)}`,
  };
}

export const getBasetokenBalance = async (address: string) => {
    const resp = await client.getBalance({
        owner: address,
        coinType: user_details.BaseToken.token,
    });
    
    const balance = (Number(resp.totalBalance) / Math.pow(10, user_details.BaseToken.decimals)).toFixed(2);
    return `${user_details.Symbol}${formatter.format(+balance)}`
};

// Example usage:
// (async () => {
//   const result = await getPortfolioValue("0xYourAddressHere");
//   console.log(result);
// })();
