import { client } from "@/config/suiClient";

const countries_token = {
    "Nigeria": "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ngnc::NGNC",
    "Ghana" : "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ngnc::NGNC"
}


const user_details = {
    "Country": "Nigeria",
    "BaseToken": {
        token: "0x1991d49c0d481f99d663b41bd9cb7163e5345fda5cbf1e6cea31f921cc457376::ngnc::NGNC",
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
