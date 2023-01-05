import {
  createClient,
  FlowProvider,
  networks,
  useAuthentication,
  useWalletDiscovery,
} from "@maggo/use-flow";

const client = createClient({
  fclConfig: {
    ...networks.mainnet,
  },
});

export default function UseWalletDiscovery() {
  return (
    <FlowProvider client={client}>
      <h1>useWalletDiscovery Example</h1>
      <Discovery />
    </FlowProvider>
  );
}

function Discovery() {
  const { wallets } = useWalletDiscovery();
  const { login } = useAuthentication();

  if (!wallets) return <p>Loading…</p>;

  return (
    <>
      <p>Available Wallets:</p>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.id}>
            {wallet.provider.name}{" "}
            <button onClick={() => login({ service: wallet })}>Connect</button>
          </li>
        ))}
      </ul>
    </>
  );
}
