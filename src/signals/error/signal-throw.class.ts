export class SignalThrow<GError = any> {
  readonly #error: GError;

  constructor(
    error: GError,
  ) {
    this.#error = error;
  }

  get error(): GError {
    return this.#error;
  }
}

