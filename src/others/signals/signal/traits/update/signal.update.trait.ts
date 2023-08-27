import { ISignalUpdateFunction } from './signal.update.function-definition';

export interface ISignalUpdateTrait<GValue> {
  update: ISignalUpdateFunction<GValue>;
}
