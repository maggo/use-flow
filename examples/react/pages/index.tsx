import Link from "next/link";

export default function Index() {
  return (
    <>
      <h1>useFlow Examples</h1>
      <ul>
        <Example name="use-authentication" />
        <Example name="use-script" />
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
