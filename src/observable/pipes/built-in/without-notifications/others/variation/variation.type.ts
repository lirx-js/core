import { IUninitializedToken } from '@lirx/utils';

export interface IVariation<GValue> {
  readonly previous: GValue | IUninitializedToken;
  readonly current: GValue;
}
