import { Transaction } from "@mysten/sui/transactions";
import { client } from "@/config/suiClient";
import clientConfig from "@/config/clientConfig";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";

const pool_ids = {
    "NGNC": {
        CoinId: "",
        PoolId: "",
        decimals: 6
    },
    "GHSC": {
        CoinId: "",
        PoolId: "",
        decimals: 6
    }
}

export async function convert(tokenA: string, tokenB: string, amount: number, conversion_rate) {

    const tokenAId = pool_ids[tokenA].CoinId;
    const tokenBId = pool_ids[tokenB].CoinId;
    const tokenAPoolId = pool_ids[tokenA].PoolId;
    const tokenBPoolId = pool_ids[tokenB].PoolId;
    const tokenADecimal = pool_ids[tokenA].decimals;
    const tokenBDecimal = pool_ids[tokenB].decimals;

    const conversion_rate_scaled = conversion_rate * tokenADecimal;

    const amt = amount * Math.pow(10, tokenADecimal);

    const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();
    const handleExecute = async (): Promise<SuiTransactionBlockResponse> => {
        const recipient = address!;
        const txb = new Transaction();

        const coins = await client.getCoins({
            owner: recipient,
            coinType: tokenAId,
        });

        let coin: any;
        if (coins.data.length === 1) {
            console.log(coins.data[0].coinObjectId);
            [coin] = txb.splitCoins(coins.data[0].coinObjectId, [amt]);
        } else if (coins.data.length > 1) {
            const coinObjectIds: string[] = [];
            const objectList = coins.data;
            coinObjectIds.push(...objectList.map(item => item.coinObjectId));

            const firstObjectId = coinObjectIds.shift();
            console.log(firstObjectId);
            if (firstObjectId !== undefined) {
                const remainingObjectIds = coinObjectIds.map(id => txb.object(id));
                txb.mergeCoins(txb.object(firstObjectId), remainingObjectIds);
                [coin] = txb.splitCoins(firstObjectId, [amt]);
            } else {
                coin = null;
            }
        } else {
            coin = null;
        }

        if (coin !== null) {
            txb.moveCall({
                arguments: [txb.object(tokenAPoolId), txb.object(tokenBPoolId), txb.object(coin), txb.pure.u64(conversion_rate_scaled), txb.pure.u8(tokenADecimal)],
                target: `${clientConfig.PACKAGE_ID}::pool_new::convert_a_to_b`,
                typeArguments: [tokenAId, tokenBId],
            });

            return await sponsorAndExecuteTransactionBlock({
                tx: txb,
                network: clientConfig.SUI_NETWORK_NAME,
                includesTransferTx: true,
                allowedAddresses: [recipient],
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                    showEvents: true,
                },
            })
                .then((resp) => {
                    console.log(resp);
                    return resp;
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
        };
    }
    return { handleExecute };
}

