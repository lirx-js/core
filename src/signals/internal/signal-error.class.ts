export class SignalError<GError = unknown> {
  static error(message?: string, options?: ErrorOptions): SignalError {
    return new SignalError(new Error(message, options));
  }

  static readonly UNSET = SignalError.error('Signal is unset.');

  readonly error: GError;

  constructor(error: GError) {
    this.error = error;
  }
}
