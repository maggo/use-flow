import { query } from "@onflow/fcl";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";

// @TODO: Refactor to better argument type system */
type Argument = [any, any];
type ArgumentFunction = (arg: Function, t: any) => Argument[];

class FlowError extends Error {
  public kind?: string;
  public internalMessage?: string;

  constructor(message: string, kind?: string, internalMessage?: string) {
    super(message);

    this.kind = kind;
    this.internalMessage = internalMessage;
  }
}

interface UseScriptProps<Result = any> {
  /**
   * The key is a string or array that identifies your query in the cache.
   *
   * @see https://react-query.tanstack.com/guides/query-keys
   */
  key: QueryKey;
  /** The cadence code of your script */
  cadence: string;
  /**
   * The arguments that are passed to your script in argument function form.
   *
   * @see https://docs.onflow.org/fcl/reference/api/#argumentfunction
   */
  args?: ArgumentFunction;
  /**
   * Optional react-query options
   *
   * @see https://react-query.tanstack.com/reference/useQuery
   */
  options?: Omit<UseQueryOptions<Result, FlowError>, "queryKey" | "queryFn">;
}

export function useScript<ResultType = any>({
  cadence,
  args,
  key,
  options,
}: UseScriptProps) {
  const result = useQuery<ResultType, FlowError>(
    key,
    () => executeScript<ResultType>({ cadence, args }),
    options
  );

  return result;
}

export async function executeScript<ResultType = any>({
  cadence,
  args,
}: {
  cadence: string;
  args: ArgumentFunction;
}): Promise<ResultType> {
  try {
    return await query({
      cadence,
      args,
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
