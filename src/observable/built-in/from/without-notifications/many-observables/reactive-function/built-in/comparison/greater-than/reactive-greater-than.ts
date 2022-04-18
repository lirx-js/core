import { IReactiveFunctionObservables } from '../../../reactive-function';
import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';

export function reactiveGreaterThan(
  ...observables: IReactiveFunctionObservables<typeof greaterThan>
): IObservable<ReturnType<typeof greaterThan>> {
  return optimizedReactiveFunction(
    observables,
    greaterThan,
  );
}

function greaterThan(a: any, b: any): boolean {
  return a > b;
}
