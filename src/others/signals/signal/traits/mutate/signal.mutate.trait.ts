import { ISignalMutateFunction } from './signal.mutate.function-definition';

export interface ISignalMutateTrait<GValue> {
  readonly mutate: ISignalMutateFunction<GValue>;
}
