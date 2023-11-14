import { IEqualFunction } from '@lirx/utils';

export interface ISignalOptions<GValue> {
  readonly equal?: IEqualFunction<GValue>;
}
