import { IReactiveFunctionObservables } from '../../../reactive-function';
import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';

export function reactiveNot(
  ...observables: IReactiveFunctionObservables<typeof not>
): IObservable<ReturnType<typeof not>> {
  return optimizedReactiveFunction(
    observables,
    not,
  );
}

function not(value: boolean): boolean {
  return !value;
}

