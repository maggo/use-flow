export class FlowError extends Error {
  public kind?: string;
  public internalMessage?: string;

  constructor(message: string, kind?: string, internalMessage?: string) {
    super(message);

    this.kind = kind;
    this.internalMessage = internalMessage;
  }
}
