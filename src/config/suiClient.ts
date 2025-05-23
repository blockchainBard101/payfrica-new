import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import clientConfig from "@/config/clientConfig";
import { SuinsClient } from '@mysten/suins';

import { useSuiClient } from "@mysten/dapp-kit";

const rpcUrl = getFullnodeUrl(clientConfig.SUI_NETWORK_NAME);

// const client = useSuiClient();
export const client = new SuiClient({ url: rpcUrl });

export const suinsClient = new SuinsClient({
	client: client as any, // Use existing SuiClient instance
	network: clientConfig.SUI_NETWORK_NAME,
});