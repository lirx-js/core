import {
  ICreatePoolingSignalOptions,
  IPoolingSignal,
  poolingSignal,
} from '../pooling-signal/pooling-signal';
import { areCSSStyleDeclarationEntriesEquivalent } from './types/css-style-declaration-entry/are-css-style-declaration-entries-equivalent';
import { ICSSStyleDeclarationEntry } from './types/css-style-declaration-entry/css-style-declaration-entry.type';
import { ICSSStyleDeclarationPropertyKeys } from './types/css-style-declaration-property-keys.type';

export interface ICreateStyleDeclarationSignalOptions
  extends Omit<
    ICreatePoolingSignalOptions<ICSSStyleDeclarationEntry>,
    'read' | 'write' | 'equal'
  > {}

export interface IStyleDeclarationSignal extends IPoolingSignal<ICSSStyleDeclarationEntry> {}

export function styleDeclarationSignal(
  style: CSSStyleDeclaration,
  propertyKey: ICSSStyleDeclarationPropertyKeys | string,
  options?: ICreateStyleDeclarationSignalOptions,
): IStyleDeclarationSignal {
  type GValue = ICSSStyleDeclarationEntry;

  return poolingSignal<GValue>({
    ...options,
    read: (): GValue => {
      return [style.getPropertyValue(propertyKey), style.getPropertyPriority(propertyKey)];
    },
    write: ([value, priority]: GValue): boolean => {
      style.setProperty(propertyKey, value, priority);
      return true;
    },
    equal: areCSSStyleDeclarationEntriesEquivalent,
  });
}
