import { IObservable } from '../../../observable/type/observable.type';
import { IObserver } from '../../../observer/type/observer.type';

export type IObservableViewObservable<GPropertyName extends string> = `${GPropertyName}$`;
export type IObservableViewObserver<GPropertyName extends string> = `$${GPropertyName}`;

export type IObservableView<GPropertyName extends string, GValue> =
  Record<GPropertyName, GValue>
  & Readonly<Record<IObservableViewObservable<GPropertyName>, IObservable<GValue>>>
  & Readonly<Record<IObservableViewObserver<GPropertyName>, IObserver<GValue>>>
  ;

