import {
  createClient,
  FlowProvider,
  networks,
  useBlock,
} from "@maggo/use-flow";
import { useState } from "react";

const client = createClient({
  fclConfig: {
    ...networks.testnet,
  },
});

export default function UseAuthentication() {
  return (
    <FlowProvider client={client}>
      <h1>useBlock Example</h1>
      <Block />
    </FlowProvider>
  );
}

function Block() {
  const [type, setType] = useState<"latest" | "id">("latest");
  const [id, setID] = useState<string>("");
  const [sealed, setSealed] = useState(false);

  const typedID = Number.parseInt(id) || id;

  const { data, isLoading, refetch } = useBlock({
    id: type === "latest" ? "latest" : typedID,
    sealed,
  });

  return (
    <>
      <div>
        <button onClick={() => refetch()} disabled={isLoading}>
          Reload
        </button>
        &nbsp;
        <fieldset>
          <label htmlFor="type__latest">
            <input
              id="type__latest"
              name="type"
              checked={type === "latest"}
              value="latest"
              onChange={(e) =>
                setType(e.currentTarget.value as "latest" | "id")
              }
              type="radio"
            />
            Latest
          </label>
          <label htmlFor="sealed">
            <input
              id="sealed"
              checked={sealed}
              onChange={() => setSealed(!sealed)}
              type="checkbox"
            />
            Sealed
          </label>
        </fieldset>
        <fieldset>
          <label htmlFor="type__id">
            <input
              id="type__id"
              name="type"
              checked={type === "id"}
              value="id"
              onChange={(e) =>
                setType(e.currentTarget.value as "latest" | "id")
              }
              type="radio"
            />
            ID
          </label>
          &nbsp;
          <input
            type="text"
            value={id}
            onChange={(e) => setID(e.currentTarget.value)}
            placeholder="Block ID or height"
          />
        </fieldset>
      </div>
      <p>
        Block Height: {isLoading ? "Loading…" : <code>{data?.height}</code>}
      </p>
      <details>
        <summary>Raw Block Data</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </>
  );
}
