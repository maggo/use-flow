import { discovery } from "@onflow/fcl";
import { useEffect, useState } from "react";
import { AddressLike } from "./misc";

interface UseWalletDiscoveryProps {
  onWallets?: (wallets: Wallet[]) => void;
}

/**
 * Discovery abstracts away code so that developers don't have to deal with the discovery of Flow compatible wallets,
 * integration, or authentication. Using discovery from FCL allows dapps to list and authenticate
 * with wallets while having full control over the UI. Common use cases for this are login or registration pages.
 *
 * @TODO Investigate Blocto wallet throwing 404 (GET instead of POST)
 * @see {@link https://developers.flow.com/tools/fcl-js/reference/api#discovery}
 */
export function useWalletDiscovery(props?: UseWalletDiscoveryProps) {
  const { onWallets } = props ?? {};
  const [wallets, setWallets] = useState<Wallet[] | null>(null);

  useEffect(() => {
    discovery.authn.subscribe(({ results }: { results: Wallet[] }) => {
      setWallets(results);
      onWallets?.(results);
    });

    // @TODO Figure out how to clean up the subscription
  }, []);

  return { isReady: wallets !== null, wallets };
}

export interface Wallet {
  f_type: "Service";
  f_vsn: string;
  type: "authn";
  uid: string;
  endpoint: string;
  method: string;
  id: string;
  identity?: {
    address: AddressLike;
  };
  provider: {
    address: AddressLike;
    color?: string;
    description: string;
    icon: string;
    install_link?: string;
    is_installed?: boolean;
    name: string;
    requires_install?: boolean;
    supportEmail?: string;
    website?: string;
  };
}
