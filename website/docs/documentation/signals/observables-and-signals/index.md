# Observable and Signal

---

:::note

If you've not started [the Observable part yet](/docs/documentation/observables/introduction/), we recommend you to read it first, and then come back here.

:::

---

Signals are not a replacement but a **complement** to Observable.

That's why, we may cast a Signal to an Observable and vice-versa.

## fromSignal(...)

```ts
function fromSignal<GValue>(
  signal: IReadonlySignal<GValue>,
  options?: IFromSignalOptionsForValueMode<GValue>,
): IObservable<GValue>;
function fromSignal<GValue>(
  signal: IReadonlySignal<GValue>,
  options: IFromSignalOptionsForNotificationMode<GValue>,
): IObservable<IObservableFromSignalNotifications<GValue>>;
```

With:

```ts
interface IFromSignalOptionsForValueMode<GValue> {
  readonly mode?: 'value';
  readonly onError?: IObservableFromSignalOnErrorFunction<GValue>;
}

interface IFromSignalOptionsForNotificationMode<GValue> {
  readonly mode: 'notification';
}
```

The `fromSignal` function is used to convert a Signal to an Observable.

It has two modes:

- `value`: returns an Observables sending only the values of the Signal.
  An `onError` function may be given (`IObservableFromSignalOnErrorFunction`), which is called when the signal enters in an *"error"* state,
  and allows us to return a different value or discard it (by default, it logs the error and discards it).
- `notification`: returns an Observables sending `next` notifications when the signal emits a value, and `error` notifications when it throws errors.


#### Example: cast a Signal to an Observable


```ts
const counter = signal(0);

const counter$ = fromSignal(counter);

counter$((count: number) => {
  console.log(`count: ${count}`);
});

window.onclick = () => {
  counter.set(counter() + 1);
};
```

Outputs:

```text
count: 0
// on click
count: 1
// ...
```

## toSignal(...)

Conversely, it is possible to convert an Observable to a Signal by using the `toSignal` function.

```ts
function toSignal<GValue>(
  value$: IObservable<GValue>,
  options?: ICreateSignalFromValueObservableOptions<GValue>,
): ISignalFromObservable<GValue>;
function toSignal<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: ICreateSignalFromNotificationsObservableOptions<GValue>,
): ISignalFromObservable<GValue>;
```

```ts
interface ISignalFromObservable<GValue> extends IReadonlySignal<GValue> {
  isActive(): boolean;

  activate(active?: boolean): void;
}

interface ICreateSignalFromObservableSharedOptions<GValue>
  extends ICreateSignalOptions<GValue> {
  readonly initialValue?: GValue;
}

interface ICreateSignalFromValueObservableOptions<GValue>
  extends ICreateSignalFromObservableSharedOptions<GValue> {
  readonly mode?: 'value'; // (default: 'value')
}

interface ICreateSignalFromNotificationsObservableOptions<GValue>
  extends ICreateSignalFromObservableSharedOptions<GValue> {
  readonly mode: 'notification';
  readonly unsubscribeOnError?: boolean; // (default: true)
}
```

The `toSignal` function internally subscribes to the given Observable and updates the returned Signal any time the Observable emits a value or notification.

### Options

The `toSignal` function accepts 2 modes:

- `value` (default): when a value is sent by the Observable, the Signal is updated with this value.
- `notification`: when a notification is sent by the Observable
  - if it's a `next` notification, then the Signal is updated with this notification's value
  - else in case of `error` notification, the signal enters an "error" state.
    If `unsubscribeOnError` is true, then the provided Observable will unsubscribe too.

You may provide an `initialValue` too.

### Returned Signal

The returned Signal is readonly and has two more methods:

#### isActive()

This method returns `true` if this Signal is currently subscribed to the Observable.

#### activate(...)

- if `true`, or not argument, is provided to this method, then the Signal subscribes to the Observable.
When a value is sent by the Observable, the Signal is updated with this value.
- if `false` is given, then the Signal unsubscribes of the Observable.

`activate(true)` is called internally in the `toSignal` function, so you don't have to call it immediately after creating the Signal from the Observable.

By nature, a Signal has no cancellation as opposed to an Observable. This is why an `activate` function is required.
You must call `activate(false)` when you want to dispose of the Signal, to free resources and avoir memory leaks.

### Examples

#### Synchronous vs Asynchronous Observables

Some Observables are known to emit synchronously, which is the desired behaviour for a Signal.

In those cases, you may get the signal's value immediately:

```ts
// this emits synchronously:
const count$ = single(50);

const count = toSignal(count$);

console.log(count());
```

However, if `count$` is ever made asynchronous (such as by adding a debounce operation, for example),
getting the signal's value before the Observable emits, will throw an error:

```ts
// this emits asynchronously:
const count$ = debounceTime$$(single(50), 100);

const count = toSignal(count$);

console.log(count()); // throws !
```

#### Initial Values

If an Observable is known to emit only asynchronously, then, we may provide an `initialValue` to the signal:

```ts
// the first value will not be emitted until 1 second later
const seconds$ = scan$$(interval(1000), _ => _ + 1, 0);

// provide an initial value of zero
const seconds = toSignal(seconds$, { initialValue: 0 });

effect(() => {
  console.log(seconds());
});
```

#### Observable of Notifications

```ts
const requestSignal = toSignal(fromFetch('https://example.com'), { mode: 'notification', initialValue: null });

effect(() => {
  try {
    const response = requestSignal();
    if (response !== null) {
      // Handle the response here
    }
  } catch (e: unknown) {
    // Handle the error from the observable here
  }
});
```

