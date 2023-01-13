import { block as fclBlock } from "@onflow/fcl";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FlowError, isFCLHTTPRequestError } from "./errors";

export interface Block {
  /** The id of the block. */
  id: string;
  /** The id of the parent block. */
  parentId: string;
  /** The height of the block. */
  height: number;
  /** Contains time related fields. */
  timestamp: string;
  /** Contains the ids of collections included in the block. */
  collectionGuarantees: { collectionId: string }[];
  /** The details of which nodes executed and sealed the blocks. */
  blockSeals: {
    blockId: string;
    executionReceiptId: string;
  }[];
  /** All signatures. */
  signatures: Uint8Array;
}

export interface UseBlockProps {
  /** ID of block to get. */
  id: "latest" | string | number;
  /** If the latest block should be sealed or not. Has no effect if id or height are specified. */
  sealed?: boolean;
  /**
   * Optional react-query options
   *
   * @see {@link https://react-query.tanstack.com/reference/useQuery}
   */
  options?: Omit<
    UseQueryOptions<
      Block,
      unknown,
      Block,
      ["useBlock", { id: "latest"; sealed?: boolean } | (string | number)]
    >,
    "queryKey" | "queryFn"
  >;
}

export function useBlock(props?: UseBlockProps) {
  const { sealed, id = "latest", options } = props ?? {};
  const isLatestQuery = id === "latest";

  return useQuery(
    ["useBlock", isLatestQuery ? { id, sealed } : id],
    () => queryBlock(id, sealed),
    {
      cacheTime: isLatestQuery ? 0 : 1000,
      keepPreviousData: false,
      ...options,
    }
  );
}

async function queryBlock(
  id: "latest" | string | number,
  sealed?: boolean
): Promise<Block> {
  try {
    if (id === "latest") {
      return await fclBlock({ sealed });
    }

    const blockId = typeof id === "string" ? id : undefined;
    const blockHeight = typeof id === "number" ? id : undefined;

    return await fclBlock({ id: blockId, height: blockHeight });
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    if (isFCLHTTPRequestError(e)) {
      throw new FlowError(e.errorMessage, { cause: e });
    }

    if (e.message) {
      throw new FlowError(e.message, { cause: e });
    }

    throw new FlowError(e.message);
  }
}
