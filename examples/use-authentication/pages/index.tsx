import { FlowProvider, createClient, useAuthentication } from "@maggo/use-flow";

const client = createClient({
  fclConfig: {
    "accessNode.api": "https://access-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  },
});

export default function Home() {
  return (
    <FlowProvider client={client}>
      <h1>useAuthentication Example</h1>
      <Login />
    </FlowProvider>
  );
}

function Login() {
  const { isReady, isLoggedIn, isLoggingIn, login, logout, user } =
    useAuthentication();

  if (!isReady) return <p>Loading…</p>;

  if (isLoggedIn) {
    return (
      <>
        <p>Address: {user?.addr}</p>
        <button onClick={() => logout()}>Logout</button>
      </>
    );
  }

  return (
    <>
      <p>You're not logged in.</p>
      <button disabled={isLoggingIn} onClick={() => login()}>
        {isLoggingIn ? "Logging in…" : "Login"}
      </button>
    </>
  );
}
