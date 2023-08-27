import { ISignalAsReadonlyFunction } from './signal.as-readonly.function-definition';

export interface ISignalAsReadonlyTrait<GValue> {
  asReadonly: ISignalAsReadonlyFunction<GValue>;
}
