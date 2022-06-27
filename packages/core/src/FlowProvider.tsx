import { config } from "@onflow/fcl";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface FCLConfig {
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
  React.useEffect(() => {
    const c = config();
    Object.entries(client.fclConfig).forEach(([key, value]) => {
      c.put(key, value);
    });
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
