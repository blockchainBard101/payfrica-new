import { client } from "@/config/suiClient";

const token_details = {
    "NGNC": {
        CoinId: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::ngnc::NGNC",
        PoolId: "",
        decimals: 6
    },
    "GHSC": {
        CoinId: "",
        PoolId: "",
        decimals: 6
    }
}
export const getTokenBalance = async (address: string, coinType: string) => {
    // console.log(token_details[coinType]);
    const resp = await client.getBalance({
        owner: address,
        coinType: token_details[coinType].CoinId,
    });

    // console.log(resp);
    return (Number(resp.totalBalance) / Math.pow(10, token_details[coinType].decimals)).toFixed(2);
};