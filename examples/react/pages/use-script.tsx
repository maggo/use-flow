import {
  createClient,
  FlowProvider,
  networks,
  useScript,
} from "@maggo/use-flow";
import { useState } from "react";

const client = createClient({
  fclConfig: {
    ...networks.mainnet,
    "0xFIND": "0x097bafa4e0b48eef",
  },
});

const CADENCE_SCRIPT = `
import FIND, Profile from 0xFIND

pub fun main(name: String): Profile.UserProfile? {
  return FIND.lookup(name)?.asProfile()
}
`;

interface Profile {
  address: string;
  name: string;
  avatar: string;
}

export default function UseScript() {
  return (
    <FlowProvider client={client}>
      <h1>useScript Example</h1>
      <FindProfile />
    </FlowProvider>
  );
}

function FindProfile() {
  const [query, setQuery] = useState("marco.find");

  const { data, isLoading, isFetching, isError, error } = useScript<Profile>({
    cadence: CADENCE_SCRIPT,
    args: (arg, t) => [arg(prepareName(query), t.String)],
  });

  const SearchHeader = (
    <form
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
      {isFetching && <span>Fetching…</span>}
    </form>
  );

  if (isLoading) {
    return (
      <>
        {SearchHeader}
        <p>Loading…</p>
      </>
    );
  }

  if (isError) {
    return (
      <>
        {SearchHeader}
        <p>Internal Error: {error.internalMessage}</p>
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
        {SearchHeader}
        <p>No profile found</p>
      </>
    );
  }

  return (
    <>
      {SearchHeader}
      <br />
      <img src={data.avatar} alt="" width={120} height={120} />
      <h2>{data.name}</h2>
      <p>{data.address}</p>
      <details>
        <summary>Raw Data</summary>
        <pre style={{ overflowX: "auto" }}>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </>
  );
}

/**
 * Remove the .find prefix for lookup
 */
function prepareName(name: string): string {
  return name.toLowerCase().replace(/\.find$/g, "");
}
