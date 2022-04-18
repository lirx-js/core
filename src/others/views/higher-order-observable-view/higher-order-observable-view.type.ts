import { IObservable } from '../../../observable/type/observable.type';
import { IObserver } from '../../../observer/type/observer.type';
import { IObservableViewObservable, IObservableViewObserver } from '../observable-view/observable-view.type';

export type IHigherOrderObservableViewObservable<GPropertyName extends string> = IObservableViewObservable<GPropertyName>;
export type IHigherOrderObservableViewObserver<GPropertyName extends string> = IObservableViewObserver<GPropertyName>;

export type IHigherOrderObservableView<GPropertyName extends string, GValue> =
  Record<GPropertyName, GValue>
  & Record<`${GPropertyName}$`, IObservable<GValue>>
  & Readonly<Record<`$${GPropertyName}`, IObserver<GValue>>>
  ;

