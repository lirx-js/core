import { readObservableValue } from '../../../misc/helpers/read-observable-value';
import { single } from '../../../observable/built-in/from/without-notifications/values/single/single';
import {
  mergeAllSingleObservable,
} from '../../../observable/pipes/built-in/without-notifications/merge/merge-all/derived/merge-all-single/merge-all-single-observable';
import { IObservable } from '../../../observable/type/observable.type';
import {
  ICreateReplayLastSourceInitialValue,
} from '../../../observer-observable-pair/build-in/source/built-in/replay-last-source/create-replay-last-source';
import {
  createMulticastReplayLastSource,
} from '../../../observer-observable-pair/build-in/source/built-in/replay-last-source/derived/create-multicast-replay-last-source';
import { IObserver } from '../../../observer/type/observer.type';
import { IObservableViewObservable, IObservableViewObserver } from '../observable-view/observable-view.type';
import { getHigherOrderObservableViewObservablePropertyName } from './get-higher-order-observable-view-observable-property-name';
import { getHigherOrderObservableViewObserverPropertyName } from './get-higher-order-observable-view-observer-property-name';
import { IHigherOrderObservableView } from './higher-order-observable-view.type';

export function createHigherOrderObservableView<GPropertyName extends string, GValue>(
  propertyName: GPropertyName,
  ...initialValue: ICreateReplayLastSourceInitialValue<GValue>
): IHigherOrderObservableView<GPropertyName, GValue> {
  const _initialValue: ICreateReplayLastSourceInitialValue<IObservable<GValue>> = (initialValue.length === 0)
    ? []
    : [single(initialValue[0])];

  const { emit, subscribe } = createMulticastReplayLastSource<IObservable<GValue>>(..._initialValue);

  const $value = (value: GValue) => {
    emit(single(value));
  };

  const value$ = mergeAllSingleObservable(subscribe);

  const observablePropertyName: IObservableViewObservable<GPropertyName> = getHigherOrderObservableViewObservablePropertyName<GPropertyName>(propertyName);
  const observerPropertyName: IObservableViewObserver<GPropertyName> = getHigherOrderObservableViewObserverPropertyName<GPropertyName>(propertyName);

  return {
    // value: GValue;
    get [propertyName](): GValue {
      return readObservableValue(value$, (): GValue => {
        console.warn(`The source did not immediately send a value`);
        return (void 0) as unknown as GValue;
      });
    },
    set [propertyName](value: GValue) {
      $value(value);
    },

    // value$: IObservable<GValue>;
    get [observablePropertyName](): IObservable<GValue> {
      return value$;
    },
    set [observablePropertyName](value: IObservable<GValue>) {
      emit(value);
    },

    // readonly $value: IObserver<GValue>;
    get [observerPropertyName](): IObserver<GValue> {
      return $value;
    },
    set [observerPropertyName](value: IObserver<GValue>) {
      throw new Error(`Readonly`);
    },
  } as IHigherOrderObservableView<GPropertyName, GValue>;
}
