export class SignalContextError extends Error {
  constructor(
    message?: string,
    options?: ErrorOptions,
  ) {
    super(
      message,
      options,
    );
    this.name = 'SignalContextError';
  }
}


