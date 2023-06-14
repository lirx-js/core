import { IEqualFunction } from '@lirx/utils';

export interface ISignalOptions<GValue> {
  equal?: IEqualFunction<GValue>;
}
