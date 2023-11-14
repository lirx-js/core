export class SignalUninitializedError extends Error {
  constructor(
    message?: string,
    options?: ErrorOptions,
  ) {
    super(
      message,
      options,
    );
    this.name = 'SignalUninitializedError';
  }
}


