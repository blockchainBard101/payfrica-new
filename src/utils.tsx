import { EnokiClient } from '@mysten/enoki';
import clientConfig from './config/clientConfig';

export const coins = [
  {
    symbol: "SUI",
    name: "SUI Token",
    logo: "/SuiLogo.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/SuiLogo.png",
  },
  {
    symbol: "NGNC",
    name: "NGNC Token",
    logo: "/SuiLogo.png",
  },
];


 
export const enokiClient = new EnokiClient({
	apiKey: clientConfig.ENOKI
});