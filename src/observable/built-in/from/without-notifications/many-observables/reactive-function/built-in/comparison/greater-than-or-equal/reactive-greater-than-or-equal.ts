import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveGreaterThanOrEqual(
  ...observables: IReactiveFunctionObservables<typeof greaterThanOrEqual>
): IObservable<ReturnType<typeof greaterThanOrEqual>> {
  return optimizedReactiveFunction(observables, greaterThanOrEqual);
}

function greaterThanOrEqual(a: any, b: any): boolean {
  return a >= b;
}
