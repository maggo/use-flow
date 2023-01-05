import { events } from "@onflow/fcl";
import { useEffect } from "react";
import { EventIdentifier } from "./misc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericEventData = Partial<Record<string, any>>;

interface UseEventSubscriptionProps<EventData extends GenericEventData> {
  /** A valid event name. */
  name: EventIdentifier;
  /** This function is being called if there's a new event available */
  onEvent?: (event: EventData) => void;
}

/**
 * This hook subscribes to a given event and calls the `onEvent` function if there's a new event available.
 *
 * The polling rate can be set via `fcl.eventPollRate` FCL config. The default is 10s.
 *
 * @TODO Refactor to custom getEvents calls since FCL events() has no error handling and isn't cancelable.
 * @see {@link https://developers.flow.com/tools/fcl-js/reference/api#events}
 */
export function useEventSubscription<EventData extends GenericEventData>({
  name,
  onEvent,
}: UseEventSubscriptionProps<EventData>) {
  useEffect(() => {
    events(name).subscribe((event: EventData) => {
      onEvent?.(event);
    });
  }, [name]);
}
