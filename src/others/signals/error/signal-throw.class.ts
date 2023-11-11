export class SignalThrow {
  readonly #error: any;

  constructor(
    error: any,
  ) {
    this.#error = error;
  }

  get error(): any {
    return this.#error;
  }
}

