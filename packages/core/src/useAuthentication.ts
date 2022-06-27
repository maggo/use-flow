import { useEffect, useState } from "react";
import { currentUser } from "@onflow/fcl";
import { useMutation } from "react-query";

interface FlowUser {
  /** The public address of the current user */
  addr: string;
  /** Allows wallets to specify a content identifier for user metadata. */
  cid: string;
  /** Allows wallets to specify a time-frame for a valid session. */
  expiresAt: number;
  /** A type identifier used internally by FCL. */
  f_type: string;
  /** FCL protocol version. */
  f_vsn: string;
  /** If the user is logged in. */
  loggedIn: boolean | null;
  /** A list of trusted services that express ways of interacting with the current user's identity, including means to further discovery, authentication, authorization, or other kinds of interactions. */
  services: any[];
}

interface UseAuthenticationAPI {
  /** The FCL user object */
  user: FlowUser | null;
  /** Set when FCL library has returned a user object */
  isReady: boolean;
  /** The user has logged in with their wallet */
  isLoggedIn: boolean;
  /** The user is currently logging in with their wallet */
  isLoggingIn: boolean;
  /** Triggers the FCL login */
  login: () => Promise<void>;
  /** Triggers the FCL logout */
  logout: () => void;
}

/**
 * This hook allows to log in and out with the user wallet.
 * @see https://docs.onflow.org/fcl/reference/api/#authenticate
 */
export function useAuthentication(): UseAuthenticationAPI {
  const [user, setUser] = useState<FlowUser | null>(null);

  const { isLoading: isLoggingIn, mutateAsync: login } = useMutation<
    void,
    Error
  >(async () => {
    // @TODO: Figure out error handling if login fails
    return currentUser.authenticate();
  });

  const { mutate: logout } = useMutation<void>(() => {
    // @TODO: Logout causes 3 rerenders of the component.
    //        Figure out what is causing this.
    return currentUser.unauthenticate();
  });

  useEffect(() => {
    currentUser.subscribe(setUser);

    return () => {
      // @TODO: Figure out how to do `currentUser.unsubscribe` in cleanup function
    };
  }, [currentUser]);

  return {
    user,
    isReady: user !== null,
    isLoggedIn: !!user?.loggedIn,
    isLoggingIn,
    login,
    logout,
  };
}
