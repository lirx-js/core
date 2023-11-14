import { ISignalUpdateFunction } from './signal.update.function-definition';

export interface ISignalUpdateTrait<GValue> {
  readonly update: ISignalUpdateFunction<GValue>;
}
