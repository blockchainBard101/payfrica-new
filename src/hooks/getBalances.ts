import { client } from "@/config/suiClient";

const countries_token = {
    "Nigeria": "0x6ef57f046c9ee96108c6309843f5d2611befb0aec7f12371cef1c6aca66a83db::ngnc::NGNC",
    "Ghana" : "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ngnc::NGNC"
}


const user_details = {
    "Country": "Nigeria",
    "BaseToken": {
        token: "0x6ef57f046c9ee96108c6309843f5d2611befb0aec7f12371cef1c6aca66a83db::ngnc::NGNC",
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
