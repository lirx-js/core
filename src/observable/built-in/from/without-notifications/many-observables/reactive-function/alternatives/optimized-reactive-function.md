## optimizedReactiveFunction or function$$


```ts
function optimizedReactiveFunction<GFunction extends IGenericFunction>(
  observables: IReactiveFunctionObservables<GFunction>,
  fnc: GFunction,
): IReactiveFunctionReturn<GFunction>
```

Most of the time, when using [reactiveFunction](../reactive-function.md), you'll usually update its observable in batch,
and would prefer to have a `reactiveFunction` that emit only once and only if the value changed.
This is the purpose of `optimizedReactiveFunction`.

It simply does:

```ts
return distinctObservable(debounceMicrotaskObservable(reactiveFunction<GFunction>(observables, fnc)));
```

### Examples

#### Perform the "sum" of two Observables

```ts

const obs1 = createMulticastReplayLastSource<number>(0);
const obs2 = createMulticastReplayLastSource<number>(0);

const subscribe = reactiveFunction(
  [obs1.subscribe, obs2.subscribe],
  (a: number, b: number) => {
    return a + b;
  },
);

subscribe((sum: number) => {
  console.log(sum);
});
obs1.emit(2);
obs2.emit(1);
console.log('end');
```

Output:

```text
'end'
3
```
