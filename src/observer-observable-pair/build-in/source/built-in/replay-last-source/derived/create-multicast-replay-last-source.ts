import { createMulticastSource } from '../../multicast-source/create-multicast-source';
import { IMulticastSource } from '../../multicast-source/multicast-source.type';
import { createReplayLastSource, ICreateReplayLastSourceInitialValue } from '../create-replay-last-source';
import { IReplayLastSource } from '../replay-last-source.type';

export type IMulticastReplayLastSource<GValue> = IReplayLastSource<GValue, IMulticastSource<GValue>>;

export function createMulticastReplayLastSource<GValue>(
  ...initialValue: ICreateReplayLastSourceInitialValue<GValue>
): IMulticastReplayLastSource<GValue> {
  return createReplayLastSource<GValue, IMulticastSource<GValue>>(
    createMulticastSource<GValue>(),
    ...initialValue,
  );
}
