import { IObservable, IUnsubscribeOfObservable } from '../../../observable/type/observable.type';
import { IMapFilterDiscard, MAP_FILTER_DISCARD } from '../../../observer/pipes/built-in/map-filter/map-filter-discard.constant';
import { IMapFilterMapFunctionReturn } from '../../../observer/pipes/built-in/map-filter/map-filter-map-function.type';
import { IObserver } from '../../../observer/type/observer.type';
import { effect } from '../../effect/effect';
import { IReadonlySignal } from '../../readonly-signal/readonly-signal.type';

export interface IObservableFromSignalOnErrorFunction<GValue> {
  (
    error: unknown,
  ): IMapFilterMapFunctionReturn<GValue>;
}

export const OBSERVABLE_FROM_SIGNAL_DEFAULT_ON_ERROR = (
  error: unknown,
): IMapFilterDiscard => {
  console.error(error);
  return MAP_FILTER_DISCARD;
};

export function fromSignal<GValue>(
  signal: IReadonlySignal<GValue>,
  onError: IObservableFromSignalOnErrorFunction<GValue> = OBSERVABLE_FROM_SIGNAL_DEFAULT_ON_ERROR,
): IObservable<GValue> {
  return (
    emit: IObserver<GValue>,
  ): IUnsubscribeOfObservable => {
    return effect((): void => {
      let value: IMapFilterMapFunctionReturn<GValue>;

      try {
        value = signal();
      } catch (error: unknown) {
        value = onError(error);
      }

      if (value !== MAP_FILTER_DISCARD) {
        emit(value);
      }
    });
  };
}

