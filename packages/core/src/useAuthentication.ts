import { currentUser } from "@onflow/fcl";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { handleFCLErrors } from "./errors";
import { AddressLike } from "./misc";
import { Wallet } from "./useWalletDiscovery";

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
  services: unknown[];
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
  login: typeof Login;
  /** Triggers the FCL logout */
  logout: () => void;
  /** A method to use allowing the user to personally sign data via FCL Compatible Wallets/Services. */
  signUserMessage?: (message: string | Buffer) => Promise<CompositeSignature[]>;
}

interface LoginProps {
  service: Wallet;
}

/**
 * This hook allows to log in and out with the user wallet.
 * @see https://docs.onflow.org/fcl/reference/api/#authenticate
 */
export function useAuthentication(): UseAuthenticationAPI {
  const [user, setUser] = useState<FlowUser | null>(null);

  const { isLoading: isLoggingIn, mutateAsync: login } = useMutation<
    void,
    Error,
    LoginProps | undefined
  >(Login);

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

  const signUserMessage = useMemo(
    () =>
      currentUser
        ? (message: string | Buffer) => {
            if (typeof message === "string") message = Buffer.from(message);
            return currentUser.signUserMessage(message.toString("hex"));
          }
        : undefined,
    [currentUser]
  );

  return {
    user,
    isReady: user !== null,
    isLoggedIn: !!user?.loggedIn,
    isLoggingIn,
    login,
    logout,
    signUserMessage,
  };
}

async function Login(props?: LoginProps): Promise<void> {
  try {
    return await currentUser.authenticate(props);
  } catch (e) {
    throw handleFCLErrors(e);
  }
}

export interface CompositeSignature {
  f_type: "CompositeSignature";
  f_vsn: string;
  addr: AddressLike;
  keyId: number;
  signature: string;
}
