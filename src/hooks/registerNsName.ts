import { client, suinsClient } from '@/config/suiClient';
import { SuinsTransaction } from "@mysten/suins";
import { Transaction } from "@mysten/sui/transactions";

export const createLeafSubname = async (name: string, parentNftId: string, targetAddress: string) => {
    // Create a transaction block as usual in your PTBs.
    const transaction = new Transaction();
    // Pass in the transaction block & the app's global SuinsClient.
    const suinsTransaction = new SuinsTransaction(suinsClient, transaction);
    const subname = name+"@payfrica"
 
    // We build the transaction to create a leaf subname.
    // A leaf subname is a subname that has a target address and no NFT of its own.
    suinsTransaction.createLeafSubName({
        // The NFT of the parent
        parentNft: parentNftId,
        // The leaf subname to be created.
        name: subname,
        // the target address of the leaf subname (any valid Sui address)
        targetAddress
    });
 
    // ... sign and execute the transaction
    try{
        const { events } = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: suinsTransaction.transaction,
            options: {
                showBalanceChanges: true,
                showEvents: true,
                showInput: false,
                showEffects: true,
                showObjectChanges: true,
                showRawInput: false,
            }
        });
    } catch{
        
    }
}

export async function nameExists(name: string) {
    // const namens = name+"@payyf";
    return !!(await suinsClient.getNameRecord(name));
}

export async function getNsAddress(name: string): Promise<string | null> {
    return (await suinsClient.getNameRecord(name))?.targetAddress || null;
}