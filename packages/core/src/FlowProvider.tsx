import { config } from "@onflow/fcl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AddressLike } from "./misc";

export interface FCLConfig extends Record<AddressLike, AddressLike> {
  "accessNode.api": string;
  "app.detail.title"?: string;
  "app.detail.icon"?: string;
  "discovery.authn.endpoint"?: string;
  "discovery.wallet": string;
  "fcl.limit"?: number;
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
  let queryClient = new QueryClient();

  return { queryClient, fclConfig };
}
