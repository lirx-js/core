import { IEqualFunction } from '../misc/equal-function/equal-function.type';

export interface ISignalOptions<GValue> {
  equal?: IEqualFunction<GValue>;
}
