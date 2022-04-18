import { IObservableViewObservable } from '../observable-view/observable-view.type';

export function getHigherOrderObservableViewObservablePropertyName<GPropertyName extends string>(
  propertyName: GPropertyName,
): IObservableViewObservable<GPropertyName> {
  return `${propertyName}$`;
}
