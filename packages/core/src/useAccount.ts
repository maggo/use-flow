import { account as fclAccount } from "@onflow/fcl";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FlowError, handleFCLErrors } from "./errors";
import { AddressLike } from "./misc";

/**
 * Return type of `fcl.account`
 *
 * @TODO Better typing
 */
export interface Account {
  address: AddressLike;
  balance: number;
  code: string;
  contracts: Record<string, string>;
  keys: {
    index: number;
    publicKey: string;
    signAlgo: number;
    signAlgoString: string;
    hashAlgo: number;
    hashAlgoString: string;
    sequenceNumber: number;
    weight: number;
    revoked: boolean;
  }[];
}

type ReturnType = Account | undefined;

export interface UseAccountProps {
  /** Address of the user account with or without a prefix (both formats are supported).
   */
  address: AddressLike;
  /**
   * Optional react-query options
   *
   * @see {@link https://react-query.tanstack.com/reference/useQuery}
   */
  options?: Omit<
    UseQueryOptions<
      ReturnType,
      FlowError,
      ReturnType,
      ["useAccount", AddressLike | undefined]
    >,
    "queryKey" | "queryFn"
  >;
}

export function useAccount(props?: UseAccountProps) {
  const { address, options } = props ?? {};

  return useQuery({
    queryKey: ["useAccount", address],
    queryFn: () => queryAccount(address),
    enabled: !!address,
    retry: false,
    ...options,
  });
}

async function queryAccount(
  address?: AddressLike
): Promise<Account | undefined> {
  if (!address) return undefined;

  try {
    return await fclAccount(address);
  } catch (e) {
    throw handleFCLErrors(e);
  }
}
