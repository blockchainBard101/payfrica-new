import { Transaction } from "@mysten/sui/transactions";
import { client } from "@/config/suiClient";
import clientConfig from "@/config/clientConfig";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";

const coin_ids = {
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
export async function sendCoinNs(coin: string, amount: number, ns_name: string) {
    const tokenId = coin_ids[coin].CoinId;
    const tokenDecimal = coin_ids[coin].decimals;

    const amt = amount * Math.pow(10, tokenDecimal);

    const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();
    const handleExecute = async (): Promise<SuiTransactionBlockResponse> => {
        const recipient = address!;
        const txb = new Transaction();

        const coins = await client.getCoins({
            owner: recipient,
            coinType: tokenId,
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
                arguments: [txb.object(coin), txb.object("0x300369e8909b9a6464da265b9a5a9ab6fe2158a040e84e808628cde7a07ee5a3"), txb.pure.string(ns_name), txb.object("0x6")],
                target: `${clientConfig.PACKAGE_ID}::send::send_ns`,
                typeArguments: [tokenId],
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

export async function sendCoinAddress(coin: string, amount: number, recipient: string) {
    const tokenId = coin_ids[coin].CoinId;
    const tokenDecimal = coin_ids[coin].decimals;

    const amt = amount * Math.pow(10, tokenDecimal);

    const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();
    const handleExecute = async (): Promise<SuiTransactionBlockResponse> => {
        const recipient = address!;
        const txb = new Transaction();

        const coins = await client.getCoins({
            owner: recipient,
            coinType: tokenId,
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
                arguments: [txb.object(coin), txb.pure.address(recipient), txb.object("0x6")],
                target: `${clientConfig.PACKAGE_ID}::send::send_coin_address`,
                typeArguments: [tokenId],
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