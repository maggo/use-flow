import {
  createClient,
  FlowProvider,
  networks,
  useAccount,
} from "@maggo/use-flow";
import { AddressLike } from "@maggo/use-flow/dist/misc";
import { useState } from "react";

const client = createClient({
  fclConfig: {
    ...networks.mainnet,
  },
});

export default function UseAccount() {
  return (
    <FlowProvider client={client}>
      <h1>useAccount Example</h1>
      <Account />
    </FlowProvider>
  );
}

function Account() {
  const [query, setQuery] = useState<AddressLike>("0xf6337be8d00d3950");

  const { data, isLoading, isFetching, isError, error } = useAccount({
    address: query,
  });

  const Header = (
    <>
      <form
        style={{ display: "flex", gap: ".5rem", alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          const el = e.currentTarget.elements.namedItem(
            "query"
          ) as HTMLInputElement;
          setQuery(el.value as AddressLike);
        }}
      >
        <input type="search" name="query" defaultValue={query} />
        <button type="submit">Submit</button>
        {isFetching && <span>Fetching…</span>}
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

  if (isError) {
    return (
      <>
        {Header}
        {!!error.internalMessage && (
          <p>Internal Error: {error.internalMessage}</p>
        )}
        <details>
          <summary>Raw Error</summary>
          <pre style={{ overflowX: "auto" }}>{error.message}</pre>
        </details>
      </>
    );
  }

  if (!data) {
    return (
      <>
        {Header}
        <p>No account found</p>
      </>
    );
  }

  return (
    <>
      {Header}
      <details open>
        <summary>Raw Data</summary>
        <pre style={{ overflowX: "auto" }}>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </>
  );
}
