import { ISignalSetFunction } from './signal.set.function-definition';

export interface ISignalSetTrait<GValue> {
  set: ISignalSetFunction<GValue>;
}
