import {
  createClient,
  FlowProvider,
  networks,
  useEventSubscription,
} from "@maggo/use-flow";
import { useState } from "react";

const client = createClient({
  fclConfig: {
    ...networks.mainnet,
    // Poll events every 5 seconds
    "fcl.eventPollRate": 5000,
  },
});

export default function UseAuthentication() {
  return (
    <FlowProvider client={client}>
      <h1>useEventSubscription Example</h1>
      <Subscription />
    </FlowProvider>
  );
}

function Subscription() {
  const [events, setEvents] = useState<FeesDeductedEvent[]>([]);

  useEventSubscription<FeesDeductedEvent>({
    name: "A.f919ee77447b7497.FlowFees.FeesDeducted",
    onEvent(event) {
      setEvents((events) => [...events, event]);
    },
  });

  if (!events.length) return <p>No events yet…</p>;

  return (
    <>
      <p>
        Latest <code>A.f919ee77447b7497.FlowFees.FeesDeducted</code> events:
      </p>
      <ul>
        {events.slice(-10).map((event, index) => (
          <li key={index}>
            <code>{JSON.stringify(event)}</code>
          </li>
        ))}
      </ul>
    </>
  );
}

interface FeesDeductedEvent {
  amount: string;
  executionEffort: string;
  inclusionEffort: string;
}
