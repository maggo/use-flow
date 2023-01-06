import {
  createClient,
  FlowProvider,
  networks,
  useAuthentication,
} from "@maggo/use-flow";
import { CompositeSignature } from "@maggo/use-flow/dist/useAuthentication";
import { useState } from "react";

const client = createClient({
  fclConfig: {
    ...networks.testnet,
  },
});

export default function UseAuthentication() {
  return (
    <FlowProvider client={client}>
      <h1>useAuthentication Example</h1>
      <Login />
    </FlowProvider>
  );
}

function Login() {
  const {
    isReady,
    isLoggedIn,
    isLoggingIn,
    login,
    logout,
    user,
    signUserMessage,
  } = useAuthentication();

  const [signedMessage, setSignedMessage] = useState<CompositeSignature[]>();

  if (!isReady) return <p>Loading…</p>;

  if (isLoggedIn) {
    return (
      <>
        <p>Address: {user?.addr}</p>
        <p>
          <button
            onClick={async () => {
              const message = await signUserMessage?.("Hello World");
              setSignedMessage(message);
            }}
          >
            Sign User Message
          </button>
        </p>
        {signedMessage && (
          <>
            <p>Signed Message:</p>
            <pre>{JSON.stringify(signedMessage, null, 2)}</pre>
          </>
        )}
        <p>
          <button onClick={() => logout()}>Logout</button>
        </p>
        <details>
          <summary>Raw Data</summary>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </details>
      </>
    );
  }

  return (
    <>
      <p>You&apos;re not logged in.</p>
      <button disabled={isLoggingIn} onClick={() => login()}>
        {isLoggingIn ? "Logging in…" : "Login"}
      </button>
    </>
  );
}
