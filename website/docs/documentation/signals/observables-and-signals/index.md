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
): ISignalFromObservable<GValue | undefined>

function toSignal<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<GValue>,
  options: IToSignalOptionsWithInitialValue<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;

function toSignal<GValue>(
  value$: IObservable<GValue>,
  options: IToSignalOptionsWithRequireSync,
): ISignalFromObservable<GValue>;
```

```ts
interface ISignalFromObservable<GValue> extends ISignal<GValue> {
  isActive(): boolean;

  activate(
    active?: boolean, // default: true
  ): this;
}
```

<details>
  <summary>IToSignalOptions</summary>

```ts
interface IToSignalOptionsWithInitialValue<GInitialValue> {
  initialValue: GInitialValue;
  requireSync?: false;
}

interface IToSignalOptionsWithRequireSync {
  requireSync: true;
}
```
</details>


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
The signature of the toSignal function supports both synchronous and asynchronous Observables.

#### Initial Values

Before the Observable emits, the signal returned by `toSignal` must have an "initial" value.

If not provided explicitly, this initial value is `undefined`.

```ts
const mousePosition: Signal<MouseEvent | undefined> = toSignal(fromEventTarget(window, mousemove));
console.log(mousePosition()); // "undefined" before the data is available
```


There are many cases where `undefined` is not the best choice of initial value.
For these cases, `toSignal` allows the initial value to be configured directly:

```ts
// The first value will not be emitted until 1 second later
const secounds$ = scan$$(interval(1000), _ => _ + 1, 0);
// Provide an initial value of zero.
const seconds = toSignal(secounds$, { initialValue: 0 });
effect(() => {
  console.log(seconds());
});
```

#### Requiring synchronous emit

Some Observables are known to emit synchronously.
In those cases, you can have `toSignal` verify that the Observable produces a value immediately, and forgo providing or dealing with an initial value.

```ts
// singlw emit synchronously:
const count$ = single(50);

const count: Signal<number> = toSignal(count$, { requireSync: true });
```

This is a trade-off: requiring a synchronous emit avoids any need for handling of `undefined` values (or manually configuring initial values)
However, if `count$` is ever made asynchronous (such as by adding a debounce operation, for example), `toSignal` will throw an error.

## toSignalWithNotifications(...)

`toSignal` works with Observables sending values. If you have Observables sending Notifications, you should use `toSignalWithNotifications`:

```ts
function toSignalWithNotifications<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
): ISignalFromObservable<GValue | undefined>;

function toSignalWithNotifications<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: IToSignalOptionsWithInitialValue<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;

function toSignalWithNotifications<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: IToSignalOptionsWithRequireSync,
): ISignalFromObservable<GValue>;
```

A signal is a wrapper around a value, which is capable of notifying interested consumers when that value changes.

A Notifications Observable has three types of Notifications when an Observer subscribes to it: `next`, `error`, and `complete`.

A Signal's value is directly linked to the values coming from the `next` notification of the Observable.

When the Observer created by `toSignalWithNotifications` is notified of an `error`,
it will throw this error the next time the Signal is read.
This error can be handled the same way any other error coming from a Signal would be:

```ts
const requestSignal = toSignalWithNotifications(fromFerch('https://example.com'));
try {
  requestSignal();
} catch (e: unknown) {
  // Handle the error from the observable here
}
```

















