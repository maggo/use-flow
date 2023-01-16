import {
  createClient,
  FlowProvider,
  networks,
  useTransactionStatus,
} from "@maggo/use-flow";
import { block, decode, getEventsAtBlockIds, send } from "@onflow/fcl";
import { useRef, useState } from "react";

const client = createClient({
  fclConfig: {
    ...networks.mainnet,
  },
});

export default function UseTransactionStatus() {
  return (
    <FlowProvider client={client}>
      <h1>useTransactionStatus Example</h1>
      <Subscription />
    </FlowProvider>
  );
}

function Subscription() {
  const formRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState<string>();

  const { status, isLoading } = useTransactionStatus({
    id: query,
  });

  async function getLatestTx() {
    const blockData = await block();

    const events = await send([
      getEventsAtBlockIds("A.f919ee77447b7497.FlowFees.FeesDeducted", [
        blockData.id,
      ]),
    ]).then(decode);

    if (!events.length) return;

    const txId = events[events.length - 1].transactionId;

    if (formRef.current) {
      const el = formRef.current.elements.namedItem(
        "query"
      ) as HTMLInputElement;

      el.value = txId;
    }

    setQuery(txId);
  }

  const Header = (
    <>
      <form
        ref={formRef}
        style={{ display: "flex", gap: ".5rem", alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          const el = e.currentTarget.elements.namedItem(
            "query"
          ) as HTMLInputElement;
          setQuery(el.value);
        }}
      >
        <input type="search" name="query" defaultValue={query} />
        <button type="submit">Submit</button>
        {" | "}
        <button type="button" onClick={() => getLatestTx()}>
          Get latest tx
        </button>
      </form>
      <br />
    </>
  );

  if (isLoading) {
    return (
      <>
        {Header}
        <p>Loading…</p>
      </>
    );
  }

  if (!status) {
    return (
      <>
        {Header}
        <p>No transaction selected…</p>
      </>
    );
  }

  return (
    <>
      {Header}
      <p>
        Transaction Status:{" "}
        <code>
          {status?.status} = {status?.statusString}
        </code>
      </p>
      <details>
        <summary>Raw Result</summary>
        <pre style={{ overflowX: "auto" }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      </details>
    </>
  );
}
