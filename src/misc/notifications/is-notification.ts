import { isObject } from '@lirx/utils';
import { INotification } from './notification.type';

export function isNotification<GName extends string, GValue>(
  value: any,
  name?: GName,
): value is INotification<GName, GValue> {
  return (
    isObject(value) &&
    'name' in value &&
    'value' in value &&
    (name === void 0 || (value as any).name === name)
  );
}
