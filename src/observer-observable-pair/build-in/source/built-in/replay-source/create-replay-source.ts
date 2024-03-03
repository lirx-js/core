import {
  IObservable,
  IUnsubscribeOfObservable,
} from '../../../../../observable/type/observable.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { ISource } from '../../type/source.type';
import { IReplaySource } from './replay-source.type';

export function createReplaySource<GValue, GSource extends ISource<GValue>>(
  source: GSource,
  maxNumberOfValues: number = Number.POSITIVE_INFINITY,
): IReplaySource<GValue, GSource> {
  const values: GValue[] = [];

  const emit: IObserver<GValue> = (value: GValue): void => {
    values.push(value);
    if (values.length > maxNumberOfValues) {
      values.shift();
    }
    source.emit(value);
  };

  const subscribe: IObservable<GValue> = (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    for (let i = 0; i < values.length; i++) {
      emit(values[i]);
    }
    return source.subscribe(emit);
  };

  const reset = (): void => {
    values.length = 0;
  };

  return {
    ...source,
    getValues: (): readonly GValue[] => {
      return values;
    },
    reset,
    emit,
    subscribe,
  };
}
