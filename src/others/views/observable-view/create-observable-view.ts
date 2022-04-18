import { readObservableValue, UNABLE_TO_READ_OBSERVABLE } from '../../../misc/helpers/read-observable-value';
import { IObservable } from '../../../observable/type/observable.type';
import {
  ICreateReplayLastSourceInitialValue,
} from '../../../observer-observable-pair/build-in/source/built-in/replay-last-source/create-replay-last-source';
import {
  createMulticastReplayLastSource,
} from '../../../observer-observable-pair/build-in/source/built-in/replay-last-source/derived/create-multicast-replay-last-source';
import { IObserver } from '../../../observer/type/observer.type';
import { IObservableView } from './observable-view.type';

export function createObservableView<GPropertyName extends string, GValue>(
  propertyName: GPropertyName,
  ...initialValue: ICreateReplayLastSourceInitialValue<GValue>
): IObservableView<GPropertyName, GValue> {
  const { emit, subscribe } = createMulticastReplayLastSource<GValue>(...initialValue);

  return {
    // value: GValue;
    get [propertyName](): GValue {
      return readObservableValue(subscribe, UNABLE_TO_READ_OBSERVABLE);
    },
    set [propertyName](value: GValue) {
      emit(value);
    },

    // readonly value$: IObservable<GValue>;
    get [`${propertyName}$`](): IObservable<GValue> {
      return subscribe;
    },
    set [`${propertyName}$`](value: IObservable<GValue>) {
      throw new Error(`Readonly`);
    },

    // readonly $value: IObserver<GValue>;
    get [`$${propertyName}`](): IObserver<GValue> {
      return emit;
    },
    set [`$${propertyName}`](value: IObserver<GValue>) {
      throw new Error(`Readonly`);
    },
  } as IObservableView<GPropertyName, GValue>;
}
