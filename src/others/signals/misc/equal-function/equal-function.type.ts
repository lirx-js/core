export interface IEqualFunction<GValue> {
  (
    a: GValue,
    b: GValue,
  ): boolean;
}
