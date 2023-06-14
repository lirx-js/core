import { IDistinctEqualFunctionOptions } from '@lirx/utils';
import { merge } from '../../../observable/built-in/from/without-notifications/many-observables/merge/merge';
import { idle } from '../../../observable/built-in/from/without-notifications/time-related/idle/idle';
import {
  distinctObservable,
} from '../../../observable/pipes/built-in/without-notifications/observer-pipe-related/distinct/distinct-observable';
import { mapObservable } from '../../../observable/pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import {
  shareObservableWithMulticastReplayLastSource,
} from '../../../observable/pipes/built-in/without-notifications/source-related/built-in/derived/multicast-replay-last-source/share-observable-with-multicast-replay-last-source';
import { IObservable } from '../../../observable/type/observable.type';
import {
  createMulticastReplayLastSource,
} from '../../../observer-observable-pair/build-in/source/built-in/replay-last-source/derived/create-multicast-replay-last-source';

function getObjectPropertyDescriptor<GValue>(
  obj: any,
  propertyKey: PropertyKey,
): TypedPropertyDescriptor<GValue> | undefined {
  if (
    (obj === null)
    || (obj === void 0)
  ) {
    return undefined;
  } else {
    const descriptor: TypedPropertyDescriptor<GValue> | undefined = Object.getOwnPropertyDescriptor(obj, propertyKey);

    return (descriptor === void 0)
      ? getObjectPropertyDescriptor<GValue>(Object.getPrototypeOf(obj), propertyKey)
      : descriptor;
  }
}

const CACHE = new WeakMap<any, Map<PropertyKey, IObservable<any>>>();

export interface ICreateObjectPropertyObservableOptions<GValue> extends IDistinctEqualFunctionOptions<GValue> {
  allowGetters?: 'throw' | 'warn' | 'allow';
}

/**
 * @experimental
 */
export function createObjectPropertyObservable<GObject, GPropertyKey extends keyof GObject>(
  obj: GObject,
  propertyKey: GPropertyKey,
  {
    allowGetters = 'warn',
    ...options
  }: ICreateObjectPropertyObservableOptions<GObject[GPropertyKey]> = {},
): IObservable<GObject[GPropertyKey]> {
  type GValue = GObject[GPropertyKey];

  let propertyCache: Map<PropertyKey, IObservable<any>>;
  if (CACHE.has(obj)) {
    propertyCache = CACHE.get(obj)!;
  } else {
    propertyCache = new Map<PropertyKey, IObservable<any>>();
    CACHE.set(obj, propertyCache);
  }

  if (propertyCache.has(propertyKey)) {
    return propertyCache.get(propertyKey)!;
  } else {
    const descriptor: TypedPropertyDescriptor<GValue> | undefined = getObjectPropertyDescriptor<GValue>(obj, propertyKey);
    const { emit: $value, subscribe: value$, getValue } = createMulticastReplayLastSource<GValue>();

    let _value$: IObservable<GValue>;

    if (descriptor === void 0) {
      _value$ = value$;

      Object.defineProperty(obj, propertyKey, {
        configurable: true,
        enumerable: true,
        get: getValue,
        set: $value,
      });
    } else {
      const { get, set, value, writable, ...properties } = descriptor;

      const _get = (get === void 0)
        ? void 0
        : (): GValue => {
          return Reflect.apply(get, obj, []);
        };

      const _set = (set === void 0)
        ? void 0
        : (value: GValue): void => {
          Reflect.apply(set, obj, [value]);
        };

      const _set$ = (_set === void 0)
        ? void 0
        : (value: GValue): void => {
          $value(value);
          _set!(value);
        };

      if (get === void 0) {
        _value$ = value$;

        if (set === void 0) { // based on value
          $value(value as GValue);

          if (writable) {
            Object.defineProperty(obj, propertyKey, {
              ...properties,
              get: getValue,
              set: $value,
            });
          } else { // readonly

          }
        } else { // pure setter => write-only
          Object.defineProperty(obj, propertyKey, {
            ...properties,
            get: () => void 0,
            set: _set$,
          });
        }
      } else {
        const _get = (): GValue => {
          return Reflect.apply(get, obj, []);
        };

        switch (allowGetters) {
          case 'throw':
            throw new Error(`Observing a getter is not allowed`);
          case 'warn':
            console.warn(`Observing a getter is not well supported`);
            break;
        }

        const valueGetter$ = mapObservable(idle(), _get);

        if (set === void 0) { // pure getter => readonly
          _value$ = valueGetter$;
        } else { // getter and setter
          _value$ = merge([
            value$,
            valueGetter$,
          ]);

          Object.defineProperty(obj, propertyKey, {
            ...properties,
            get: _get,
            set: _set$,
          });
        }

        _value$ = shareObservableWithMulticastReplayLastSource(
          distinctObservable(_value$, options),
        );
      }
    }

    propertyCache.set(propertyKey, _value$);

    return _value$;
  }
}
