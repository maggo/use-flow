import { AppUtils } from "@onflow/fcl";
import { AddressLike } from "./misc";
import { CompositeSignature } from "./useAuthentication";

interface verifyUserSignaturesOptions {
  fclCryptoContract?: AddressLike;
}

/**
 *
 * @param message A hexadecimal string or buffer to be signed
 * @param compositeSignatures An Array of `CompositeSignatures`
 * @param opts `opts.fclCryptoContract` can be provided to override FCLCryptoContract address for local development
 * @returns
 */
export async function verifyUserSignatures(
  message: string | Buffer,
  compositeSignatures: CompositeSignature[],
  opts?: verifyUserSignaturesOptions
): Promise<boolean> {
  if (typeof message === "string") message = Buffer.from(message);
  return AppUtils.verifyUserSignatures(
    message.toString("hex"),
    compositeSignatures,
    opts
  );
}
