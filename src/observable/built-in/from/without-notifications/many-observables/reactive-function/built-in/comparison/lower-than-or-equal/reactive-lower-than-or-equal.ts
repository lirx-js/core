import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveLowerThanOrEqual(
  ...observables: IReactiveFunctionObservables<typeof lowerThanOrEqual>
): IObservable<ReturnType<typeof lowerThanOrEqual>> {
  return optimizedReactiveFunction(observables, lowerThanOrEqual);
}

function lowerThanOrEqual(a: any, b: any): boolean {
  return a <= b;
}
