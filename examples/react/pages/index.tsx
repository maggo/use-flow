import Link from "next/link";

export default function Index() {
  return (
    <>
      <h1>useFlow Examples</h1>
      <ul>
        <Example name="use-authentication" />
        <Example name="use-script" />
        <Example name="use-block" />
        <Example name="use-event-subscription" />
        <Example name="use-wallet-discovery" />
        <Example name="use-mutation" />
        <Example name="use-account" />
        <Example name="use-transaction-status" />
      </ul>
    </>
  );
}

function Example({ name }: { name: string }) {
  return (
    <li>
      <Link href={`/${name}`}>{name}</Link>
    </li>
  );
}
