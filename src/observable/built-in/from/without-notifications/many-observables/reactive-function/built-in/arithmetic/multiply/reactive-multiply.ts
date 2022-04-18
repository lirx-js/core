import { IReactiveFunctionObservables } from '../../../reactive-function';
import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';

export function reactiveMultiply(
  ...observables: IReactiveFunctionObservables<typeof multiply>
): IObservable<ReturnType<typeof multiply>> {
  return optimizedReactiveFunction(
    observables,
    multiply,
  );
}

function multiply(a: number, b: number): number {
  return a * b;
}

