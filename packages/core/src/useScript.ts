import { query } from "@onflow/fcl";
import * as types from "@onflow/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ArgFunc, ArgType, ArgumentFunction } from "./arguments";
import { FlowError, handleFCLErrors } from "./errors";

// @TODO Replace with @onflow/sdk arg function
const arg: ArgFunc<any, any> = (value: unknown, xform: ArgType) => ({
  value,
  xform,
});

interface UseScriptProps<ResultType = unknown> {
  /**
   * The cadence code of your script
   */
  cadence: string;
  /**
   * The arguments that are passed to your script in argument function form.
   *
   * @see {@link https://docs.onflow.org/fcl/reference/api/#argumentfunction}
   */
  args: ArgumentFunction;
  /**
   * Optional gas limit for this script.
   *
   * @see {@link https://docs.onflow.org/fcl/reference/api/#options}
   */
  limit?: number;
  /**
   * Optional react-query options
   *
   * @see {@link https://react-query.tanstack.com/reference/useQuery}
   */
  options?: Omit<
    UseQueryOptions<ResultType, FlowError, ResultType, any>,
    "queryKey" | "queryFn"
  >;
}

/**
 * This hook provides an abstraction of the FCL `query` functionality.
 *
 * @see {@link https://docs.onflow.org/fcl/reference/api/#query}
 */
export function useScript<ResultType = unknown>({
  cadence,
  args,
  limit,
  options,
}: UseScriptProps<ResultType>) {
  const resolvedArgs = args ? args(arg, types) : [];

  const result = useQuery<ResultType, FlowError>(
    ["useQuery", cadence, resolvedArgs],
    () => executeScript<ResultType>({ cadence, args, limit }),
    options
  );

  return result;
}

interface ExecuteScriptProps {
  cadence: string;
  args: ArgumentFunction;
  limit?: number;
}

/**
 * Helper function that wraps the FCL `query` function and adds custom error handling.
 */
export async function executeScript<ResultType = unknown>({
  cadence,
  args,
  limit,
}: ExecuteScriptProps): Promise<ResultType> {
  try {
    return await query({
      cadence,
      args,
      limit,
    });
  } catch (e) {
    throw handleFCLErrors(e);
  }
}
