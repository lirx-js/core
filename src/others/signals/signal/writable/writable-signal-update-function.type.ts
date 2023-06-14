export interface IWritableSignalUpdateFunction<GValue> {
  (
    value: GValue,
  ): GValue;
}
