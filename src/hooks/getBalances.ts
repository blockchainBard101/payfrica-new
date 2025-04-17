import { client } from "@/config/suiClient";

const countries_token = {
    "Nigeria": "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::ngnc::NGNC",
    "Ghana" : "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ngnc::NGNC"
}


const user_details = {
    "Country": "Nigeria",
    "BaseToken": {
        token: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::ngnc::NGNC",
        decimals: 6,
    },
    "Symbol": "₦"
}

export const getBasetokenBalance = async (address: string) => {
    const resp = await client.getBalance({
        owner: address,
        coinType: user_details.BaseToken.token,
    });
    
    const balance = (Number(resp.totalBalance) / Math.pow(10, user_details.BaseToken.decimals)).toFixed(2);
    return user_details.Symbol + balance.toString();
};
