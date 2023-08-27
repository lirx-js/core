export interface ISignalSetFunction<GValue> {
  (
    value: GValue,
    force?: boolean,
  ): void;
}
