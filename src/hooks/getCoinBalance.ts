import { client } from "@/config/suiClient";

const token_details = {
    "NGNC": {
        CoinId: "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ngnc::NGNC",
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