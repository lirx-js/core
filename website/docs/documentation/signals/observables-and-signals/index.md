# Observable and Signal

Signals are not a replacement but a **complement** to Observable.

That's why, we may cast a Signal to an Observable and vice-versa.

## signal.toObservable(...)

```ts
interface IReadonlySignal<GValue> {
  // ...
  toObservable(
    options?: ISignalToValueObservableOptions<GValue>,
  ): IObservable<GValue>;
  toObservable(
    options: ISignalToNotificationsObservableOptions,
  ): IObservable<ISignalNotifications<GValue>>;
}
```

The `toObservable` method is used to convert a Signal to an Observable.

It accepts an optional `ISignalToXXXObservableOptions` argument:

```ts
interface ISignalToObservableSharedOptions {
  readonly emitCurrentValue?: boolean; // (default: true)
  readonly debounce?: boolean; // (default: true)
}

interface ISignalToValueObservableOnErrorFunction<GValue> {
  (
    error: unknown,
  ): IMapFilterMapFunctionReturn<GValue>;
}

interface ISignalToValueObservableOptions<GValue> extends ISignalToObservableSharedOptions {
  readonly mode?: 'value'; // (default: 'value')
  readonly onError?: ISignalToValueObservableOnErrorFunction<GValue>; // (default: logs the error, and discards the value)
}

interface ISignalToNotificationObservableOptions extends ISignalToObservableSharedOptions {
  readonly mode: 'notification';
}
```

- `mode`: (default: `value`) - it defines the type of values send by the returned Observable.
  - `value`: values only are sent. If the signal enters an "error" state, then an error is thrown.
  - `notification`: notifications are sent. If the signal enters an "error" state, then an `error` notification is sent. Else, the signal values are sent through `next` notifications.
- `onError`: called if the `mode` is `value` and the signal enters an "error" state.
- `emitCurrentValue`: (default: `true`) - if set to `true`, then, when the returned Observable is subscribed, the Signal will immediately emit its current value.
  Else, the values are sent only when the Signal changes.
- `debounce`: (default: `true`) - Observables are not [glitch-free](https://en.wikipedia.org/wiki/Reactive_programming#Glitches) by nature.
  Keeping this value to `true` ensures that the values sent by the Signal are glitch-free (using a [microtask debounce](/docs/reference/debounce-microtask-observable-pipe/)).
  If not wanted, you may set it to `false`. In this case, it must be used with **extreme caution**.


## toSignal(...)

Conversely, it is possible to convert an Observable to a Signal by using the `toSignal` function.

```ts
function toSignal<GValue>(
  value$: IObservable<GValue>,
  options?: ISignalFromValueObservableOptions<GValue>
): ISignalFromObservable<GValue>;
function toSignal<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: ISignalFromNotificationsObservableOptions<GValue>,
): ISignalFromObservable<GValue>;
```

```ts
interface ISignalFromObservable<GValue> extends IReadonlySignal<GValue> {
  isActive(): boolean;

  activate(
    active?: boolean, // default: true
  ): void;
}

interface ISignalFromObservableSharedOptions<GValue> extends ISignalOptions<GValue> {
}

interface ISignalFromValueObservableOptions<GValue> extends ISignalFromObservableSharedOptions<GValue> {
  readonly mode?: 'value'; // (default: 'value')
}

interface ISignalFromNotificationsObservableOptions<GValue> extends ISignalFromObservableSharedOptions<GValue> {
  readonly mode: 'notification';
  readonly unsubscribeOnError?: boolean; // (default: true)
}
```

The `toSignal` function internally subscribes to the given Observable and updates the returned Signal any time the Observable emits a value or notification.

### Options

The `toSignal` function accepts 2 modes:

- `value`: when a value is sent by the Observable, the Signal is updated with this value.
- `notification`: when a notification is sent by the Observable
  - if it's a `next` notification, then the Signal is updated with this notification's value
  - else in case of `error` notification, the signal enters an "error" state.
    If `unsubscribeOnError` is true, then the provided Observable will unsubscribe too.


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

If an Observable is known to emit only asynchronously, then, we may want to make it synchronous:

```ts
// the first value will not be emitted until 1 second later
const secondsAsynchonous$ = scan$$(interval(1000), _ => _ + 1, 0);
const secondsSynchonous$ = merge([
  single(0), // initial value
  secondsAsynchonous$,
]);
// provide an initial value of zero
const seconds = toSignal(secondsSynchonous$);

effect(() => {
  console.log(seconds());
});
```

#### Observable of Notifications

```ts
const requestSignal = toSignal(fromFetch('https://example.com'), { mode: 'notification' });

effect(() => {
  try {
    const response = requestSignal();
  } catch (e: unknown) {
    if (!(e instanceof SignalUninitializedError)) {
      // Handle the error from the observable here
    }
  }
});
```



