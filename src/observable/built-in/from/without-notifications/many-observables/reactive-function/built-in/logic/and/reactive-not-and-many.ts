import { IObservable } from '../../../../../../../../type/observable.type';
import { IReactiveFunctionObservables } from '../../../reactive-function';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';


export function reactiveNotAndMany(
  ...observables: IReactiveFunctionObservables<typeof notAndMany>
): IObservable<ReturnType<typeof notAndMany>> {
  return optimizedReactiveFunction(
    observables,
    notAndMany,
  );
}

function notAndMany(...values: boolean[]): boolean {
  for (let i = 0, l = values.length; i < l; i++) {
    if (!values[i]) {
      return true;
    }
  }
  return false;
}

