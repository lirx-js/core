import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function debugObservable<GValue>(
  subscribe: IObservable<GValue>,
  name: string,
  color: string = `hsl(${Math.floor(Math.random() * 360).toString(10)}deg, 100%, 25%)`,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let running: boolean = true;

    console.log(`%c[ SUB ]%c ${name}`, `color: #2dba52`, `color: ${color}`);

    const unsubscribe: IUnsubscribeOfObservable = subscribe((value: GValue): void => {
      console.log(`%c[VALUE]%c ${name}`, `color: #0e82e8`, `color: ${color}`, value);
      emit(value);
    });

    return (): void => {
      if (running) {
        running = false;
        console.log(`%c[UNSUB]%c ${name}`, `color: #e83115`, `color: ${color}`);
        unsubscribe();
      }
    };
  };
}
