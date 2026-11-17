import { IObjectValueFromPropertyKey } from './object-value-from-property-key.type';

const OBJECT_PROTOTYPE = Object.getPrototypeOf({});

export function getPropertyDescriptor<GObject extends object, GPropertyKey extends PropertyKey>(
  obj: GObject,
  propertyKey: GPropertyKey,
): TypedPropertyDescriptor<IObjectValueFromPropertyKey<GObject, GPropertyKey>> | undefined {
  let descriptor:
    | TypedPropertyDescriptor<IObjectValueFromPropertyKey<GObject, GPropertyKey>>
    | undefined;

  while (
    obj !== OBJECT_PROTOTYPE &&
    (descriptor = Object.getOwnPropertyDescriptor(obj, propertyKey)) === undefined
  ) {
    obj = Object.getPrototypeOf(obj);
  }

  return descriptor;
}
