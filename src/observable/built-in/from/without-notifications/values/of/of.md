## of

```ts
function of<GValue>(
  ...values: GValue[]
): IObservable<GValue>
```

Creates an Observable from a list of values Array. It emits the values one by one.

Spread equivalent of [fromArray](../../iterable/from-array/from-array.md).

### Examples

#### Basic example

```ts
const subscribe = of(0, 1, 2, 3);

subscribe((value: number) => {
  console.log(value);
});
```

Output:

```text
0
1
2
3
```


