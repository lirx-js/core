export interface ISignalUpdateFunctionCallback<GValue> {
  (
    value: GValue,
  ): GValue;
}

export interface ISignalUpdateFunction<GValue> {
  (
    updateFunction: ISignalUpdateFunctionCallback<GValue>,
  ): void;
}
