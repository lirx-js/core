## fromIterable

```ts
function fromIterable<GValue>(
  iterable: Iterable<GValue>,
): IObservable<GValue>
```

Creates an Observable from an Iterable. It emits values of the iterable one by one.

See [fromIterator](../from-iterator/from-iterator.md) for more details.

### Examples

#### Simple Iterable which emits values from 0 to 9

```ts
const subscribe = fromIterable(
  (function * () {
    for (let i = 0; i < 10; i++) {
      yield i;
    }
  })()
);

subscribe((value: number) => {
  console.log(value);
});
```

Output:

```text
0
1
...
9
```

