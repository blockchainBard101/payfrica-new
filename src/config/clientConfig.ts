import { z } from "zod";

/*
 * The schema for the client-side environment variables
 * These variables should be defined in the app/.env file
 * These variables are NOT SECRET, they are exposed to the client side
 * They can and should be tracked by Git
 * All of the env variables must have the NEXT_PUBLIC_ prefix
 */

const clientConfigSchema = z.object({
  SUI_NETWORK: z.string(),
  SUI_NETWORK_NAME: z.enum(["mainnet", "testnet"]),
  ENOKI_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  PACKAGE_ID: z.string(),
  PAYFRICA_PRIVATE_KEY: z.string(),
  PAYFRICA_AGENT_ID: z.string(),
  NS_REGISTRY_ID: z.string(),
  ENOKI: z.string(),
  PAYFRICA_POOL_ID: z.string(),
  PAYFRICA_TEMP_CARD_ID: z.string(),
});

const clientConfig = clientConfigSchema.parse({
  SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK!,
  SUI_NETWORK_NAME: process.env.NEXT_PUBLIC_SUI_NETWORK_NAME as
    | "mainnet"
    | "testnet",
  ENOKI_API_KEY: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID!,
  PAYFRICA_PRIVATE_KEY: process.env.NEXT_PUBLIC_PAYFRICA_PRIVATE_KEY!,
  PAYFRICA_AGENT_ID: process.env.NEXT_PUBLIC_PAYFRICA_AGENT_ID!,
  NS_REGISTRY_ID: process.env.NEXT_PUBLIC_NS_REGISTRY_ID!,
  ENOKI: process.env.NEXT_PUBLIC_ENOKI_SECRET_KEY!,
  PAYFRICA_POOL_ID: process.env.NEXT_PUBLIC_PAYFRICA_POOL_ID!,
  PAYFRICA_TEMP_CARD_ID: process.env.NEXT_PUBLIC_PAYFRICA_TEMP_CARD_ID!,
});

export default clientConfig;
