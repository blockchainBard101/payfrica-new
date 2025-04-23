import { client, suinsClient } from '@/config/suiClient';
import { SuinsTransaction } from "@mysten/suins";
import { Transaction } from "@mysten/sui/transactions";
import axios from 'axios';
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import clientConfig from '@/config/clientConfig';

export const createLeafSubname = async (name: string, parentNftId: string, targetAddress: string) => {
    const keypair = Ed25519Keypair.fromSecretKey(clientConfig.PAYFRICA_PRIVATE_KEY);
    const transaction = new Transaction();
    const suinsTransaction = new SuinsTransaction(suinsClient, transaction);
    const subname = name+"@payfrica"
 
    suinsTransaction.createLeafSubName({
        parentNft: parentNftId,
        name: subname,
        targetAddress
    });
 
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


async function resolveNameServiceNames(address) {
  const rpcUrl = 'https://fullnode.testnet.sui.io:443';
  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'suix_resolveNameServiceNames',
    params: [
      address
    ]
  };

  const { data: response } = await axios.post(rpcUrl, requestBody, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.error) {
    throw new Error(`RPC error ${response.error.code}: ${response.error.message}`);
  }

  return response.result;
}

function formatSuiName(rawName) {
  if (!rawName.endsWith('.sui')) {
    return rawName;
  }

  const withoutTld = rawName.slice(0, -4);

  const parts = withoutTld.split('.');

  if (parts.length === 1) {
    return `@${parts[0]}`;
  }

  if (parts.length === 2) {
    return `${parts[0]}@${parts[1]}`;
  }

  const last = parts.pop();
  return `${parts.join('.') }@${last}`;
}


export async function getFormattedSuiHandle(address) {
    console.log(address);
  const { data } = await resolveNameServiceNames(address);
  return data[0];
//   if (!Array.isArray(data) || data.length === 0) {
//     return null;  // No names resolved
//   }
//   const rawName = data[0];
//   console.log(rawName);
//   return formatSuiName(rawName);
}

