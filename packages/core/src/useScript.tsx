import { query } from "@onflow/fcl";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ArgumentFunction } from "./arguments";
import { FlowError } from "./errors";

interface UseScriptProps<Result = any> {
  /**
   * The key is a string or array that identifies your query in the cache.
   *
   * @see {@link https://react-query.tanstack.com/guides/query-keys}
   */
  key: QueryKey;
  /**
   * The cadence code of your script
   */
  cadence: string;
  /**
   * The arguments that are passed to your script in argument function form.
   *
   * @see {@link https://docs.onflow.org/fcl/reference/api/#argumentfunction}
   */
  args?: ArgumentFunction;
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
  options?: Omit<UseQueryOptions<Result, FlowError>, "queryKey" | "queryFn">;
}

/**
 * This hook provides an abstraction of the FCL `query` functionality.
 *
 * @see {@link https://docs.onflow.org/fcl/reference/api/#query}
 */
export function useScript<ResultType = any>({
  cadence,
  args,
  limit,
  key,
  options,
}: UseScriptProps) {
  const result = useQuery<ResultType, FlowError>(
    key,
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

export async function executeScript<ResultType = any>({
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
  } catch (e: any) {
    if (e.message) {
      // @TODO: Implement custom error system */
      const matches = (e.message as string).match(/^error: (.*): (.*)$/m);
      if (!matches) throw e;

      const [, kind, internalMessage] = matches;

      throw new FlowError(e.message, kind, internalMessage);
    }

    throw new FlowError(e.message);
  }
}
