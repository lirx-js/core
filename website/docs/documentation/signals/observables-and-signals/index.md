# Observable and Signal

Signals are not a replacement but a **complement** to Observable.

That's why, we may cast a Signal to an Observable and vice-versa.

## signal.toObservable(...)

The `toObservable` method is used to convert a Signal to an Observable.

It accepts an optional `ISignalToObservableOptions` argument:

```ts
interface ISignalToObservableOptions {
  emitCurrentValue?: boolean; // (default: true)
  debounce?: boolean; // (default: true)
}
```

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
): ISignalFromObservable<GValue>;

function toSignal<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<GValue>,
  options: ISignalFromObservableOptions<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;
```

```ts
interface ISignalFromObservable<GValue> extends IReadonlySignal<GValue> {
  isActive(): boolean;

  activate(
    active?: boolean, // default: true
  ): void;
}

interface ISignalFromObservableOptions<GInitialValue> {
  initialValue: GInitialValue;
}
```

The `toSignal` function internally subscribes to the given Observable and updates the returned Signal any time the Observable emits a value.

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

### Options

Observables can be used to model both synchronous and asynchronous data flow.
However, they don't distinguish these two cases in their API - any Observable *might* be synchronous, or it *might* be asynchronous.
Signals, on the other hand, are always synchronous.
The signature of the `toSignal` function supports both synchronous and asynchronous Observables.

#### Synchronous emit

Some Observables are known to emit synchronously, which is the desired behaviour for a Signal.

In those cases, you may omit to provide the second arguments `options`.

```ts
// this emits synchronously:
const count$ = single(50);

const count = toSignal(count$);
```

However, if `count$` is ever made asynchronous (such as by adding a debounce operation, for example), `toSignal` will throw an error.


#### Initial Values

If an Observable is known to emit only asynchronously, then, we'll have to define an **initial value**.
If it is synchronous, this initial value is optional.

The initial value may have the same type as the Observable:

```ts
// the first value will not be emitted until 1 second later
const seconds$ = scan$$(interval(1000), _ => _ + 1, 0);
// provide an initial value of zero
const seconds = toSignal(seconds$, { initialValue: 0 });
effect(() => {
  console.log(seconds());
});
```

**OR** may be `undefined` or `null`:

```ts
const mousePosition: Signal<MouseEvent | undefined> = toSignal(fromEventTarget(window, mousemove), { initialValue: undefined });
console.log(mousePosition()); // "undefined" before the data is available
```


## toSignalWithNotifications(...)

`toSignal` works with Observables sending simple values.
If you have Observables sending Notifications, you should use `toSignalWithNotifications`:

```ts
function toSignalWithNotifications<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
): ISignalFromObservable<GValue>;

function toSignalWithNotifications<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: ISignalFromObservableOptions<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;
```



If a `next` Notification is received, then the Signal will take this Notification's value.

In the case of an `error` Notification, then the Signal will throw this error the next time the Signal is read.
This error can be handled the same way any other error coming from a Signal would be:

```ts
const requestSignal = toSignalWithNotifications(fromFerch('https://example.com'));
try {
  requestSignal();
} catch (e: unknown) {
  // Handle the error from the observable here
}
```

Finally, if a `complete` or `error` Notification occurs, then the Observable is simply unsubscribed, **but remains active**.


