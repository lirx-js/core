import { IGenericSource, ISource } from '../../type/source.type';

export interface IReplayLastSourceMethods<GValue> {
  getValue(unsafe?: false): GValue;

  getValue(unsafe: true): GValue | undefined;
}

export type IReplayLastSource<GValue, GSource extends ISource<GValue>> =
  Omit<GSource, keyof IReplayLastSourceMethods<GValue>>
  & IReplayLastSourceMethods<GValue>;

/* derived */

export type IGenericReplayLastSource = IReplayLastSource<any, IGenericSource>;


