import { FCLConfig } from "./FlowProvider";

/**
 * Default access node and wallet discovery config for mainnet
 */
export const mainnet: FCLConfig = {
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint":
    "https://fcl-discovery.onflow.org/api/mainnet/authn",
  "flow.network": "mainnet",
};

/**
 * Default access node and wallet discovery config for testnet
 */
export const testnet: FCLConfig = {
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/mainnet/authn",
  "discovery.authn.endpoint":
    "https://fcl-discovery.onflow.org/api/testnet/authn",
  "flow.network": "testnet",
};

/**
 * Default access node and wallet discovery config for canarynet
 */
export const canarynet: FCLConfig = {
  "accessNode.api": "https://rest-canarynet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/canarynet/authn",
  "discovery.authn.endpoint":
    "https://fcl-discovery.onflow.org/api/canarynet/authn",
  "flow.network": "canarynet",
};

/**
 * Default access node and wallet discovery config for local emulator network
 *
 * @warning Requires the flow emulator network and flow dev-wallet to be running
 */
export const local: FCLConfig = {
  "accessNode.api": "http://localhost:8888",
  "discovery.wallet": "http://localhost:8701/fcl/authn",
  "flow.network": "local",
};
