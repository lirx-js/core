import { IObserver } from '../../../type/observer.type';
import { IObserverPipe } from '../../type/observer-pipe.type';
import { distinctObserver } from './distinct-observer';

/**
 * Returns an Observer that emits all items emitted by the source Observer that are distinct by comparison from previous values
 */
export function distinctObserverPipe<GValue>(
  previousValue?: GValue,
): IObserverPipe<GValue, GValue> {
  return (emit: IObserver<GValue>): IObserver<GValue> => {
    return distinctObserver<GValue>(emit, previousValue);
  };
}


