import { ISignalMutateFunction } from './signal.mutate.function-definition';

export interface ISignalMutateTrait<GValue> {
  mutate: ISignalMutateFunction<GValue>;
}
