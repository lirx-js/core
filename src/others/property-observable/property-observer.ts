import { EQUAL_FUNCTION_STRICT_EQUAL, IEqualFunction } from '@lirx/utils';
import { idle } from '../../observable/built-in/from/without-notifications/time-related/idle/idle';
import { getPropertyDescriptor } from './get-property-descriptor';
import { IObjectValueFromPropertyKey } from './object-value-from-property-key.type';

export interface IPropertyObserverOnChangeFunction<GValue> {
  (previousValue: GValue | undefined, currentValue: GValue): void;
}

export interface IPropertyObserverOptions<GValue> {
  readonly equal?: IEqualFunction<GValue>;
  readonly getterSource?: (update: () => any) => any;
}

type IGetFunction<GValue> = () => GValue;
type ISetFunction<GValue> = (value: GValue) => void;

export function propertyObserver<GObject extends object, GPropertyKey extends PropertyKey>(
  obj: GObject,
  propertyKey: GPropertyKey,
  onChange: IPropertyObserverOnChangeFunction<IObjectValueFromPropertyKey<GObject, GPropertyKey>>,
  {
    equal = EQUAL_FUNCTION_STRICT_EQUAL,
    getterSource = idle(),
  }: IPropertyObserverOptions<IObjectValueFromPropertyKey<GObject, GPropertyKey>> = {},
): void {
  type GValue = IObjectValueFromPropertyKey<GObject, GPropertyKey>;

  const descriptor: TypedPropertyDescriptor<GValue> | undefined = getPropertyDescriptor<
    GObject,
    GPropertyKey
  >(obj, propertyKey);

  let currentValue: GValue;

  const setValue = (newValue: GValue): void => {
    const previousValue: GValue = currentValue;
    currentValue = newValue;

    if (!equal(previousValue, currentValue)) {
      onChange(previousValue, currentValue);
    }
  };

  const enumerable: boolean = descriptor?.enumerable ?? true;
  let get: IGetFunction<GValue> | undefined;
  let set: ISetFunction<GValue> | undefined;
  let init: () => any | undefined;

  if (descriptor === undefined || 'value' in descriptor) {
    get = (): GValue => {
      return currentValue;
    };

    set = function (this: any, currentValue: GValue): void {
      if (this === obj) {
        setValue(currentValue);
      } else {
        Reflect.set(this, propertyKey, currentValue, this);
      }
    };

    init = () => setValue(descriptor?.value!);
  } else {
    const _get: IGetFunction<GValue> | undefined = descriptor.get;
    const _set: ISetFunction<GValue> | undefined = descriptor.set;

    if (_get === undefined) {
      // pure setter
      throw new Error('This property has no getter nor value, and thus, cannot be observed.');
      // set = _set;
    } else {
      const update = (): void => {
        setValue(_get.call(obj));
      };

      get = _get;

      if (_set !== undefined) {
        set = function (this: any, currentValue: GValue): void {
          _set.call(this, currentValue);

          if (this === obj) {
            update();
          }
        };
      }

      init = () => getterSource(update);
    }
  }

  Object.defineProperty(obj, propertyKey, {
    configurable: false,
    enumerable,
    get,
    set,
  });

  init!?.();
}
