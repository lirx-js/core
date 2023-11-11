export interface ISignalMutateFunctionCallback<GMutableValue> {
  (
    value: GMutableValue,
  ): void;
}

export interface ISignalMutateFunction<GValue> {
  <GMutableValue extends GValue>(
    mutateFunction: ISignalMutateFunctionCallback<GMutableValue>,
  ): void;
}
