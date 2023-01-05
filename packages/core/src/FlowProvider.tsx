import { config } from "@onflow/fcl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AddressLike } from "./misc";

/**
 * FCL has a mechanism that lets you configure various aspects of FCL.
 * When you move from one instance of the Flow Blockchain to another (Local Emulator to Testnet to Mainnet)
 * the only thing you should need to change for your FCL implementation is your configuration.
 *
 * @see {@link https://developers.flow.com/tools/fcl-js/reference/api#configuration}
 */
export interface FCLConfig extends Record<AddressLike, AddressLike> {
  /**
   * API URL for the Flow Blockchain Access Node you want to be communicating with.
   * See all available access node endpoints {@link https://developers.onflow.org/http-api/ here}.
   */
  "accessNode.api": string;
  /** Your applications title, can be requested by wallets and other services. */
  "app.detail.title"?: string;
  /** Url for your applications icon, can be requested by wallets and other services. */
  "app.detail.icon"?: string;
  /**
   * Endpoint for alternative configurable Wallet Discovery mechanism.
   * Read more on {@link https://developers.flow.com/tools/fcl-js/reference/api#discovery discovery}
   */
  "discovery.authn.endpoint"?: string;
  /** Points FCL at the Wallet or Wallet Discovery mechanism. */
  "discovery.wallet": string;
  /** Which service strategy a wallet should use. */
  "discovery.wallet.method"?:
    | "IFRAME/RPC"
    | "POP/RPC"
    | "TAB/RPC"
    | "HTTP/POST"
    | "EXT/RPC";
  /** An array of services you'd like your app to opt-in to displaying for users. */
  "discovery.authn.include"?: AddressLike[];
  /** Polling rate for events in milliseconds.
   *
   * @default 10_000
   */
  "fcl.eventPollRate"?: number;
  /**
   * Specifies fallback compute limit if not provided in transaction.
   * Provided as integer.
   *
   * @default 1000
   */
  "fcl.limit"?: number;
  /** Used in conjunction with stored interactions and provides `FCLCryptoContract` address for `testnet` and `mainnet`.  */
  "flow.network"?: "local" | "canarynet" | "testnet" | "mainnet";
}

interface FlowProviderProps {
  children: React.ReactNode;
  client: FlowClient;
}

export function FlowProvider({ children, client }: FlowProviderProps) {
  // @TODO Investigate better way to apply config
  // We want to be SSR friendly, so we can't use useEffect/useLayoutEffect
  React.useLayoutEffect(() => {
    config(client.fclConfig);
  }, [client.fclConfig]);

  return (
    <QueryClientProvider client={client.queryClient}>
      <>{children}</>
    </QueryClientProvider>
  );
}

interface CreateClientProps {
  fclConfig: FCLConfig;
}

interface FlowClient {
  queryClient: QueryClient;
  fclConfig: FCLConfig;
}

export function createClient({ fclConfig }: CreateClientProps): FlowClient {
  const queryClient = new QueryClient();

  return { queryClient, fclConfig };
}
