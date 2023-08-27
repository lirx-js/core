import { IReadonlySignalGetFunction } from './readonly-signal.get.function-definition';

export interface IReadonlySignalGetTrait<GValue> {
  get: IReadonlySignalGetFunction<GValue>;
}
