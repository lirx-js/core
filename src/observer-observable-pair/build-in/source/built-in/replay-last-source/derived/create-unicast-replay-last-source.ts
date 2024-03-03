import { createUnicastSource } from '../../unicast-source/create-unicast-source';
import { IUnicastSource } from '../../unicast-source/unicast-source.type';
import {
  createReplayLastSource,
  ICreateReplayLastSourceInitialValue,
} from '../create-replay-last-source';
import { IReplayLastSource } from '../replay-last-source.type';

export type IUnicastReplayLastSource<GValue> = IReplayLastSource<GValue, IUnicastSource<GValue>>;

export function createUnicastReplayLastSource<GValue>(
  ...initialValue: ICreateReplayLastSourceInitialValue<GValue>
): IUnicastReplayLastSource<GValue> {
  return createReplayLastSource<GValue, IUnicastSource<GValue>>(
    createUnicastSource<GValue>(),
    ...initialValue,
  );
}
