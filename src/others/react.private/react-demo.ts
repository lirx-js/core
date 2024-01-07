import { DependencyList, useEffect, useState } from 'react';
import { IObservable } from '../../observable/type/observable.type';

export function useObservableFactory<GValue>(
  factory: () => IObservable<GValue>,
  initialValue?: GValue,
  deps: DependencyList = [],
): GValue {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    return factory()(setValue);
  }, deps);

  return value;
}

export function useObservable<GValue>(
  subscribe: IObservable<GValue>,
  initialValue?: GValue,
): GValue {
  return useObservableFactory<GValue>(() => subscribe, initialValue, []);
}

// https://reactjs.org/docs/hooks-custom.html
