import { IObjectValueFromPropertyKey } from '../../../others/property-observable/object-value-from-property-key.type';
import {
  ICreatePoolingSignalOptions,
  IPoolingSignal,
  poolingSignal,
} from '../pooling-signal/pooling-signal';

export interface ICreatePropertySignalOptions<
  GObject extends object,
  GPropertyKey extends PropertyKey,
> extends Omit<
    ICreatePoolingSignalOptions<IObjectValueFromPropertyKey<GObject, GPropertyKey>>,
    'read' | 'write'
  > {}

export interface IPropertySignal<GObject extends object, GPropertyKey extends PropertyKey>
  extends IPoolingSignal<IObjectValueFromPropertyKey<GObject, GPropertyKey>> {}

export function propertySignal<GObject extends object, GPropertyKey extends PropertyKey>(
  obj: GObject,
  propertyKey: GPropertyKey,
  options?: ICreatePropertySignalOptions<GObject, GPropertyKey>,
): IPropertySignal<GObject, GPropertyKey> {
  type GValue = IObjectValueFromPropertyKey<GObject, GPropertyKey>;

  return poolingSignal<GValue>({
    ...options,
    read: (): GValue => Reflect.get(obj, propertyKey),
    write: (value: GValue): boolean => {
      if (Reflect.set(obj, propertyKey, value)) {
        return true;
      } else {
        throw new Error(`Failed to set property ${JSON.stringify(propertyKey)}.`);
      }
    },
  });
}
