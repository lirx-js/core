
import { IObserver } from '../../../../type/observer.type';
import { IObserverPipe } from '../../../type/observer-pipe.type';
import { debounceTimeObserver } from './debounce-time-observer';

/**
 * @deprecated
 * BAD because the timer cannot be cancelled
 */
export function debounceTimeObserverPipe<GValue>(
  duration: number,
): IObserverPipe<GValue, GValue> {
  return (emit: IObserver<GValue>): IObserver<GValue> => {
    return debounceTimeObserver<GValue>(emit, duration);
  };
}

