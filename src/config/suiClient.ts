import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import clientConfig from "@/config/clientConfig";
import { SuinsClient } from '@mysten/suins';

const rpcUrl = getFullnodeUrl(clientConfig.SUI_NETWORK_NAME);
export const client = new SuiClient({ url: rpcUrl });

export const suinsClient = new SuinsClient({
	client,
	network: clientConfig.SUI_NETWORK_NAME,
});