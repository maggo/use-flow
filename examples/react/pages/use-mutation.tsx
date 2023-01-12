import {
  createClient,
  FlowProvider,
  networks,
  useMutation,
} from "@maggo/use-flow";
import { FormEvent } from "react";

const client = createClient({
  fclConfig: {
    ...networks.testnet,
    "fcl.limit": 1000,
    "0xPROFILE": "0xba1132bc08f82fe2",
  },
});

const CADENCE_SCRIPT = `
import Profile from 0xPROFILE

transaction(name: String) {
  prepare(account: AuthAccount) {
    account
      .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
      .setName(name)
  }
}
`;

export default function UseMutation() {
  return (
    <FlowProvider client={client}>
      <h1>useMutation Example</h1>
      <UpdateProfile />
    </FlowProvider>
  );
}

function UpdateProfile() {
  const {
    mutateAsync: updateName,
    isLoading,
    data,
    isSuccess,
    error,
    isError,
  } = useMutation({
    cadence: CADENCE_SCRIPT,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nameItem = form.elements.namedItem("name") as HTMLInputElement;
    const name = nameItem.value;

    await updateName({
      args: (arg, t) => [arg(name, t.String)],
    });

    form.reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
          <legend>Profile</legend>
          <p>
            <label htmlFor="name">New Profile Name</label>{" "}
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              required
            />
          </p>
          <button>Submit</button>
        </fieldset>
        <br />
        {isSuccess && <p>Success! TransactionID: {data}</p>}
        {isError && (
          <>
            {!!error.internalMessage && (
              <p>Internal Error: {error.internalMessage}</p>
            )}
            <details>
              <summary>Raw Error</summary>
              <pre style={{ overflowX: "auto" }}>{error.message}</pre>
            </details>
          </>
        )}
      </form>
    </>
  );
}
