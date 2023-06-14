export class Context<GValue> {
  #value: GValue;

  constructor(
    initialValue: GValue,
  ) {
    this.#value = initialValue;
  }

  run<GReturn>(
    value: GValue,
    callback: () => GReturn
  ): GReturn {
    let _value: GValue = this.#value;
    try {
      this.#value = value;
      return callback();
    } finally {
      this.#value = _value;
    }
  }

  get(): GValue {
    return this.#value;
  }
}
