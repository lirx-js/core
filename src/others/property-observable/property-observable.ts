import { idle } from '../../observable/built-in/from/without-notifications/time-related/idle/idle';
import { IObservable, IUnsubscribeOfObservable } from '../../observable/type/observable.type';
import { IMulticastSource } from '../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { createMulticastReplayLastSource } from '../../observer-observable-pair/build-in/source/built-in/replay-last-source/derived/create-multicast-replay-last-source';
import { IObserver } from '../../observer/type/observer.type';
import { IObjectValueFromPropertyKey } from './object-value-from-property-key.type';
import { IPropertyObserverOptions, propertyObserver } from './property-observer';

const OBSERVED_PROPERTIES = new WeakMap<any, Map<any, IObservable<any>>>();

export interface IPropertyObservableOptions<GValue>
  extends Omit<IPropertyObserverOptions<GValue>, 'getterSource'> {
  readonly getterSource?: IObservable<any>;
}

export function propertyObservable<GObject extends object, GPropertyKey extends PropertyKey>(
  obj: GObject,
  propertyKey: GPropertyKey,
  {
    getterSource = idle(),
    ...options
  }: IPropertyObservableOptions<IObjectValueFromPropertyKey<GObject, GPropertyKey>> = {},
): IObservable<IObjectValueFromPropertyKey<GObject, GPropertyKey>> {
  type GValue = IObjectValueFromPropertyKey<GObject, GPropertyKey>;

  let propertiesMap: Map<any, IObservable<GValue>> | undefined = OBSERVED_PROPERTIES.get(obj);

  if (propertiesMap === undefined) {
    propertiesMap = new Map<any, IObservable<GValue>>();
    OBSERVED_PROPERTIES.set(obj, propertiesMap);
  }

  let observable: IObservable<GValue> | undefined = propertiesMap.get(propertyKey);

  if (observable === undefined) {
    let observersCount: number = 0;

    let source: IMulticastSource<GValue> | undefined;
    let update: () => any | undefined;
    let unsubscribe: IUnsubscribeOfObservable | undefined;

    const start = (): void => {
      if (source === undefined) {
        source = createMulticastReplayLastSource<GValue>();
        propertyObserver<GObject, GPropertyKey>(
          obj,
          propertyKey,
          (_, currentValue: GValue): void => {
            source!.emit(currentValue);
          },
          {
            ...options,
            getterSource: (_update: () => any): any => {
              update = _update;
              _update();
            },
          },
        );
      }

      if (unsubscribe === undefined && update !== undefined) {
        unsubscribe = getterSource(update);
      }
    };

    const stop = (): void => {
      if (unsubscribe !== undefined) {
        unsubscribe();
        unsubscribe = undefined;
      }
    };

    observable = (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
      let running: boolean = true;

      observersCount++;

      if (observersCount === 1) {
        start();
      }

      const unsubscribeOfSource: IUnsubscribeOfObservable = source!.subscribe(emit);

      return (): void => {
        if (running) {
          running = false;
          unsubscribeOfSource();

          observersCount--;

          if (observersCount === 0) {
            stop();
          }
        }
      };
    };
    propertiesMap.set(propertyKey, observable);
  }

  return observable;
}
