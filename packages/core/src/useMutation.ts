import { mutate } from "@onflow/fcl";
import {
  useMutation as useReactQueryMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { ArgumentFunction } from "./arguments";
import { FlowError, handleFCLErrors } from "./errors";

/**
 * The authorization function is used to specify the payer, proposer or authorizer of a transaction.
 * @TODO Add better typing
 */
type AuthorizationFunction = (account: any) => any;

interface UseMutationProps {
  /**
   * The cadence code of your script
   */
  cadence: string;
  /**
   * Optional gas limit for this script.
   *
   * @see {@link https://docs.onflow.org/fcl/reference/api/#options}
   */
  limit?: number;
  /** The authorizer who will propose, pay and authorize the transaction */
  authz?: AuthorizationFunction;
  /** Explicitly set the authorizer who will pay for the transaction */
  payer?: AuthorizationFunction;
  /** Explicitly set the authorizer who will propose the transaction */
  proposer?: AuthorizationFunction;
  /** Explicitly set the authorizers of the transaction */
  authorizations?: AuthorizationFunction[];
  /**
   * Optional react-query options
   *
   * @see {@link https://react-query.tanstack.com/reference/useQuery}
   */
  options?: UseMutationOptions<string, FlowError, MutationArguments>;
}

interface MutationArguments {
  args: ArgumentFunction;
}

/**
 * This hook provides an abstraction of the FCL `mutate` functionality.
 *
 * @see {@link https://docs.onflow.org/fcl/reference/api/#mutate}
 */
export function useMutation({
  cadence,
  limit,
  authz,
  payer,
  proposer,
  authorizations,
  options,
}: UseMutationProps) {
  const mutationFn = useCallback(
    ({ args }: MutationArguments) =>
      executeMutate({
        cadence,
        args,
        limit,
        authz,
        payer,
        proposer,
        authorizations,
      }),
    []
  );
  const result = useReactQueryMutation(mutationFn, options);

  return result;
}

interface ExecuteMutateProps {
  cadence: string;
  args: ArgumentFunction;
  limit?: number;
  authz?: AuthorizationFunction;
  payer?: AuthorizationFunction;
  proposer?: AuthorizationFunction;
  authorizations?: AuthorizationFunction[];
}

/**
 * Helper function that wraps the FCL `mutate` function and adds custom error handling.
 *
 * @returns {Promise<string>} The transaction ID
 */
async function executeMutate({
  cadence,
  args,
  limit,
}: ExecuteMutateProps): Promise<string> {
  try {
    return mutate({
      cadence,
      args,
      limit,
    });
  } catch (e) {
    throw handleFCLErrors(e);
  }
}
