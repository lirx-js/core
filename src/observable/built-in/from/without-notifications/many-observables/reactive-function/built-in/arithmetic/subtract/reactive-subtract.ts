import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveSubtract(
  ...observables: IReactiveFunctionObservables<typeof subtract>
): IObservable<ReturnType<typeof subtract>> {
  return optimizedReactiveFunction(observables, subtract);
}

function subtract(a: number, b: number): number {
  return a - b;
}
