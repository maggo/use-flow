import { tx } from "@onflow/fcl";
import { useEffect, useState } from "react";

export enum TransactionStatus {
  /** Transaction unknown */
  Unknown = 0,
  /**	Transaction Pending - Awaiting Finalization */
  Pending = 1,
  /** Transaction Finalized - Awaiting Execution */
  Finalized = 2,
  /** Transaction Executed - Awaiting Sealing */
  Executed = 3,
  /** Transaction Sealed - Transaction Complete. At this point the transaction result has been committed to the blockchain. */
  Sealed = 4,
  /** Transaction Expired */
  Expired = 5,
}

interface Event {
  type: string;
  transactionId: string;
  transactionIndex: number;
  eventIndex: number;
  data: Record<string, any>;
}

interface TransactionResult {
  blockId: string;
  errorMessage: string;
  events: Event[];
  status: TransactionStatus;
  statusCode: 0 | 1;
  statusString: "SEALED";
}

interface UseTransactionStatusProps {
  /** A valid transaction id. */
  id?: string;
  /** Provides the transaction once status `2` is returned. */
  onceFinalized?: (txStatus: TransactionResult) => void;
  /** Provides the transaction once status `3` is returned. */
  onceExecuted?: (txStatus: TransactionResult) => void;
  /** Provides the transaction once status `4` is returned. */
  onceSealed?: (txStatus: TransactionResult) => void;
}

/**
 * This hook enables you to get status updates (via polling) and the finalized result of a transaction once available.
 *
 * The status is polled every 2.5 seconds.
 *
 * @TODO Refactor to custom getTransactionStatus calls since FCL tx() has no error handling and isn't cancelable.
 * @TODO Investigate transaction statuses that are just empty strings
 * @see {@link https://developers.flow.com/tools/fcl-js/reference/api#tx}
 */
export function useTransactionStatus({
  id,
  onceFinalized,
  onceExecuted,
  onceSealed,
}: UseTransactionStatusProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<TransactionResult>();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const txHandler = tx(id);
    txHandler.subscribe((txStatus: TransactionResult) => {
      setIsLoading(false);
      setStatus(txStatus);
    });

    txHandler.onceFinalized(onceFinalized);
    txHandler.onceExecuted(onceExecuted);
    txHandler.onceSealed(onceSealed);
  }, [id]);

  return {
    isLoading,
    status,
    isFinalized: status?.status === TransactionStatus.Finalized,
    isExecuted: status?.status === TransactionStatus.Executed,
    isSealed: status?.status === TransactionStatus.Sealed,
  };
}
