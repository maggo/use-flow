import {
  createClient,
  FlowProvider,
  networks,
  useAuthentication,
} from "@maggo/use-flow";

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
  const { isReady, isLoggedIn, isLoggingIn, login, logout, user } =
    useAuthentication();

  if (!isReady) return <p>Loading…</p>;

  if (isLoggedIn) {
    return (
      <>
        <p>Address: {user?.addr}</p>
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
