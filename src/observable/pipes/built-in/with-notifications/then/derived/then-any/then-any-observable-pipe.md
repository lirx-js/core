## thenAnyObservablePipe or thenAny$$$

```ts
function thenAnyObservablePipe<GInNextValue, GOut>(
  onThenAny: IThenAnyObservableCallback<GInNextValue, GOut>,
): IObservablePipe<IThenObservableInNotifications<GInNextValue>, GOut>
```

This function is similar to the method `.then` of a Promise:

When a `complete` or `error` Notification is received, `onThenAny` is called with the resolved state.

Then, it emits the values from the Observable returned by `onThenAny`.

### Example

```ts
const subscribe = pipe$$(request$, [
  thenAnyObservable(({ state }): IObservable<IEmptyObservableNotifications> => {
    return single(`state: ${state}`);
  }),
]);

subscribe((value) => {
  console.log(nvalue);
});
```

Output:

```text
// request if succeed
'state fulfilled'
```


