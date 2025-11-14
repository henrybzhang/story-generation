export class AppError extends Error {
  public readonly status: number;
  public readonly params: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    params?: Record<string, unknown>,
    cause?: Error,
  ) {
    // Call the parent constructor (Error)
    super(message, { cause });

    // Set the status code
    this.status = status;
    this.params = params || {};

    // Set the prototype explicitly to ensure 'instanceof' works correctly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
