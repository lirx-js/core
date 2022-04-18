import { IObservableViewObserver } from '../observable-view/observable-view.type';

export function getHigherOrderObservableViewObserverPropertyName<GPropertyName extends string>(
  propertyName: GPropertyName,
): IObservableViewObserver<GPropertyName> {
  return `$${propertyName}`;
}
