import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveAdd(
  ...observables: IReactiveFunctionObservables<typeof add>
): IObservable<ReturnType<typeof add>> {
  return optimizedReactiveFunction(observables, add);
}

function add(a: number, b: number): number {
  return a + b;
}
