import { freeze } from '../../../../../misc/helpers/freeze';
import { IObservable, IUnsubscribe } from '../../../../../observable/type/observable.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { ISource } from '../../type/source.type';
import { IReplayLastSource } from './replay-last-source.type';

export type ICreateReplayLastSourceInitialValue<GValue> = [] | [GValue];

export function createReplayLastSource<GValue, GSource extends ISource<GValue>>(
  source: GSource,
  ...initialValue: ICreateReplayLastSourceInitialValue<GValue>
): IReplayLastSource<GValue, GSource> {
  let currentValue: GValue;
  let initialized: boolean;

  if (initialValue.length === 0) {
    initialized = false;
  } else {
    initialized = true;
    currentValue = initialValue[0];
  }

  const emit: IObserver<GValue> = (value: GValue): void => {
    initialized = true;
    currentValue = value;
    source.emit(value);
  };

  const subscribe: IObservable<GValue> = (emit: IObserver<GValue>): IUnsubscribe => {
    if (initialized) {
      emit(currentValue as GValue);
    }
    return source.subscribe(emit);
  };

  return freeze({
    ...source,
    getValue: (): GValue => {
      return currentValue as GValue;
    },
    emit,
    subscribe,
  });
}

