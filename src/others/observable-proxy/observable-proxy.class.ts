import { mapObservable } from '../../observable/pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { IObservable } from '../../observable/type/observable.type';
import {
  createMulticastReplayLastSource,
  IMulticastReplayLastSource,
} from '../../observer-observable-pair/build-in/source/built-in/replay-last-source/derived/create-multicast-replay-last-source';
import { IObserver } from '../../observer/type/observer.type';

/** TYPES **/

/* ARRAY */

export type IArrayOfValuesToArrayOfObservableProxy<GArray extends readonly any[]> = {
  [GKey in keyof GArray]: ObservableProxy<GArray[GKey]>;
};

export type IObservableProxyArray$<GValue> = GValue extends readonly any[]
  ? IObservable<IArrayOfValuesToArrayOfObservableProxy<GValue>>
  : never;

/* PURE PROXY */

export type IPureObservableProxy<GValue> = {
  [GKey in keyof GValue]: IPureObservableProxy<GValue[GKey]>;
} & {
  $: IObservable<GValue>;
  array$: IPureObservableProxyArray$<GValue>;
  __proxy__: ObservableProxy<GValue>;
};

export type IArrayOfValuesToArrayOfPureObservableProxy<GArray extends readonly any[]> = {
  [GKey in keyof GArray]: IPureObservableProxy<GArray[GKey]>;
};

export type IPureObservableProxyArray$<GValue> = GValue extends readonly any[]
  ? IObservable<IArrayOfValuesToArrayOfPureObservableProxy<GValue>>
  : never;

/** CLASS **/

export class ObservableProxy<GValue> {
  readonly value$: IObservable<GValue>;
  protected _cachedGetProxies: Map<PropertyKey, ObservableProxy<unknown>>;
  protected _cachedArray$!: IObservableProxyArray$<GValue>;
  protected _cachedArray$Proxies: ObservableProxy<unknown>[];
  protected _cachedArray$Observers: IObserver<unknown>[];
  protected _cachedPureProxy!: IPureObservableProxy<GValue>;

  constructor(value$: IObservable<GValue>) {
    this.value$ = value$;
    this._cachedGetProxies = new Map<PropertyKey, ObservableProxy<unknown>>();
    this._cachedArray$Proxies = [];
    this._cachedArray$Observers = [];
  }

  get $(): IObservable<GValue> {
    return this.value$;
  }

  get<GKey extends keyof GValue>(propertyKey: GKey): ObservableProxy<GValue[GKey]> {
    let cachedProxy: ObservableProxy<unknown> | undefined = this._cachedGetProxies.get(propertyKey);
    if (cachedProxy === void 0) {
      cachedProxy = new ObservableProxy<GValue[GKey]>(
        mapObservable(this.value$, (value: GValue): GValue[GKey] => {
          return value?.[propertyKey] as GValue[GKey];
        }),
      );
      this._cachedGetProxies.set(propertyKey, cachedProxy);
    }
    return cachedProxy as ObservableProxy<GValue[GKey]>;
  }

  get$<GKey extends keyof GValue>(propertyKey: GKey): IObservable<GValue[GKey]> {
    return this.get(propertyKey).value$;
  }

  array$(): IObservableProxyArray$<GValue> {
    if (this._cachedArray$ === void 0) {
      this._cachedArray$ = mapObservable(this.value$, (array: GValue): unknown => {
        if (Array.isArray(array)) {
          const arrayLength: number = array.length;
          const cachedArray$ProxiesLength: number = this._cachedArray$Proxies.length;

          if (arrayLength !== cachedArray$ProxiesLength) {
            this._cachedArray$Proxies.length = arrayLength;
            this._cachedArray$Observers.length = arrayLength;

            if (arrayLength > cachedArray$ProxiesLength) {
              for (let i = cachedArray$ProxiesLength; i < arrayLength; i++) {
                const { emit, subscribe }: IMulticastReplayLastSource<unknown> =
                  createMulticastReplayLastSource<unknown>();
                this._cachedArray$Proxies[i] = new ObservableProxy<unknown>(subscribe);
                this._cachedArray$Observers[i] = emit;
              }
            }
          }

          for (let i = 0; i < arrayLength; i++) {
            this._cachedArray$Observers[i](array[i]);
          }

          return this._cachedArray$Proxies;
        } else {
          throw new Error(`Not an array`);
        }
      }) as IObservableProxyArray$<GValue>;
    }
    return this._cachedArray$;
  }

  proxy(): IPureObservableProxy<GValue> {
    if (this._cachedPureProxy === void 0) {
      let cachedArray$!: IObservable<IPureObservableProxy<unknown>[]>;
      const cachedArray$Proxies: IPureObservableProxy<unknown>[] = [];

      this._cachedPureProxy = new Proxy<any>(Object.create(null), {
        get: (target: any, propertyKey: PropertyKey): any => {
          if (propertyKey === '$') {
            return this.$;
          } else if (propertyKey === 'array$') {
            if (cachedArray$ === void 0) {
              cachedArray$ = mapObservable(
                this.array$() as any as IObservable<ObservableProxy<unknown>[]>,
                (array: ObservableProxy<unknown>[]): IPureObservableProxy<unknown>[] => {
                  const arrayLength: number = array.length;
                  const cachedArray$ProxiesLength: number = cachedArray$Proxies.length;

                  if (arrayLength !== cachedArray$ProxiesLength) {
                    cachedArray$Proxies.length = arrayLength;
                  }

                  for (let i = cachedArray$ProxiesLength; i < arrayLength; i++) {
                    cachedArray$Proxies[i] = array[i].proxy();
                  }

                  return cachedArray$Proxies;
                },
              );
            }

            return cachedArray$;
          } else if (propertyKey === '__proxy__') {
            return this;
          } else {
            return this.get(propertyKey as keyof GValue).proxy();
          }
        },
        set: (): never => {
          throw new Error(`The proxy is readonly`);
        },
      });
    }
    return this._cachedPureProxy;
  }
}
