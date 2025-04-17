import { client } from "@/config/suiClient";

const token_details = {
    "NGNC": {
        CoinId: "0x6ef57f046c9ee96108c6309843f5d2611befb0aec7f12371cef1c6aca66a83db::ngnc::NGNC",
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