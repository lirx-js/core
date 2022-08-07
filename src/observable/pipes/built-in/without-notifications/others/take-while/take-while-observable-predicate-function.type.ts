export interface ITakeWhileObservablePredicateFunction<GValue> {
  (
    value: GValue,
    index: number,
  ): boolean;
}
