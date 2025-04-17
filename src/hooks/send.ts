import { Transaction } from "@mysten/sui/transactions";
import { client } from "@/config/suiClient";
import clientConfig from "@/config/clientConfig";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { getNsAddress } from "./registerNsName";

const coin_ids = {
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

export function useSendCoinNs() {
    const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();

    return async function sendCoinNs(
        coin: keyof typeof coin_ids,
        amount: number,
        ns_name: string
    ): Promise<boolean> {
        const { CoinId: tokenId, decimals: tokenDecimal } = coin_ids[coin];
        const amt = BigInt(Math.floor(amount * 10 ** tokenDecimal));

        // build the TX
        const txb = new Transaction();

        // fetch coins from chain
        const coins = await client.getCoins({
            owner: address!,
            coinType: tokenId,
        });

        const recipient = await getNsAddress(ns_name);
        const ns_name_converted = convertNsNameToSui(ns_name);
        console.log(ns_name_converted);
        let coinObj;
        if (coins.data.length === 0) {
            throw new Error("No coins of that type available");
        } else if (coins.data.length === 1) {
            [coinObj] = txb.splitCoins(coins.data[0].coinObjectId, [amt]);
        } else {
            const ids = coins.data.map((c) => c.coinObjectId);
            const [first, ...rest] = ids;
            txb.mergeCoins(txb.object(first), rest.map((id) => txb.object(id)));
            [coinObj] = txb.splitCoins(first, [amt]);
        }
        //   console.log(coinObj);
        //   txb.transferObjects([coinObj], txb.pure.address(recipient));

        txb.moveCall({
            target: `${clientConfig.PACKAGE_ID}::send::send_ns`,
            typeArguments: [tokenId],
            arguments: [
                txb.object(coinObj),
                txb.object("0x300369e8909b9a6464da265b9a5a9ab6fe2158a040e84e808628cde7a07ee5a3"),
                txb.pure.string(ns_name_converted),
                txb.object("0x6"),
            ],
        });

        const resp = await sponsorAndExecuteTransactionBlock({
            tx: txb,
            network: clientConfig.SUI_NETWORK_NAME,
            includesTransferTx: true,
            allowedAddresses: [recipient!],
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true,
            },
        });

        console.log(resp);
        if (resp) {
            return true;
        }

        return false;
        //   return resp.effects?.status.status === "success";
    };
}

export function useSendCoinAdd() {
    const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();

    return async function sendCoinAdd(
        coin: keyof typeof coin_ids,
        amount: number,
        recipient: string
    ): Promise<boolean> {
        const { CoinId: tokenId, decimals: tokenDecimal } = coin_ids[coin];
        const amt = BigInt(Math.floor(amount * 10 ** tokenDecimal));

        // build the TX
        const txb = new Transaction();

        // fetch coins from chain
        const coins = await client.getCoins({
            owner: address!,
            coinType: tokenId,
        });

        console.log(recipient);
        let coinObj;
        if (coins.data.length === 0) {
            throw new Error("No coins of that type available");
        } else if (coins.data.length === 1) {
            [coinObj] = txb.splitCoins(coins.data[0].coinObjectId, [amt]);
        } else {
            const ids = coins.data.map((c) => c.coinObjectId);
            const [first, ...rest] = ids;
            txb.mergeCoins(txb.object(first), rest.map((id) => txb.object(id)));
            [coinObj] = txb.splitCoins(first, [amt]);
        }

        txb.moveCall({
            target: `${clientConfig.PACKAGE_ID}::send::send_coin_address`,
            typeArguments: [tokenId],
            arguments: [
                txb.object(coinObj),
                txb.pure.address(recipient),
                txb.object("0x6"),
            ],
        });

        const resp = await sponsorAndExecuteTransactionBlock({
            tx: txb,
            network: clientConfig.SUI_NETWORK_NAME,
            includesTransferTx: true,
            allowedAddresses: [recipient!],
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true,
            },
        });

        console.log(resp);
        if (resp) {
            return true;
        }

        return false;
        //   return resp.effects?.status.status === "success";
    };
}

function convertNsNameToSui(nsName: string): string {
    const atIndex = nsName.indexOf('@');
    if (atIndex === -1) {
        throw new Error(
            `Invalid NS name "${nsName}". Expected format "user@domain" or "@domain".`
        );
    }

    const userPart = nsName.substring(0, atIndex).trim();
    const domainPart = nsName.substring(atIndex + 1).trim();

    if (!domainPart) {
        throw new Error(`Invalid NS name "${nsName}". Domain is missing.`);
    }

    return userPart
        ? `${userPart}.${domainPart}.sui`
        : `${domainPart}.sui`;
}