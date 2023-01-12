import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveDivide(
  ...observables: IReactiveFunctionObservables<typeof divide>
): IObservable<ReturnType<typeof divide>> {
  return optimizedReactiveFunction(
    observables,
    divide,
  );
}

function divide(a: number, b: number): number {
  return a / b;
}

