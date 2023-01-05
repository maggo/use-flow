export class FlowError extends Error {
  public kind?: string;
  public internalMessage?: string;
  public cause?: Error;

  constructor(message: string, options?: FlowErrorOptions) {
    super(message);

    const { kind, internalMessage, cause } = options ?? {};

    this.kind = kind;
    this.internalMessage = internalMessage;
    this.cause = cause;
  }
}

interface FlowErrorOptions {
  kind?: string;
  internalMessage?: string;
  cause?: Error;
}

export interface FCLHTTPRequestError extends Error {
  name: string;
  errorMessage: string;
}

/**
 * Check if the error object is of HTTPRequestError type.
 *
 * We can't use instanceof because the custom error type is not exported from FCL.
 * @see {@link https://github.com/onflow/fcl-js/blob/9a1eb2b3dec369d4f35ec2aa8b753ec1230c0efe/packages/transport-http/src/http-request.js#L4}
 */
export function isFCLHTTPRequestError(
  error: Error
): error is FCLHTTPRequestError {
  return error.name === "HTTP Request Error";
}
