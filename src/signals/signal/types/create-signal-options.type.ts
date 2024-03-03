import { IEqualFunction } from '@lirx/utils';

export interface ICreateSignalOptions<GValue> {
  readonly equal?: IEqualFunction<GValue>;
}
