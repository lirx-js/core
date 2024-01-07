import { ISignalSetFunction } from './signal.set.function-definition';

export interface ISignalSetTrait<GValue> {
  readonly set: ISignalSetFunction<GValue>;
}
