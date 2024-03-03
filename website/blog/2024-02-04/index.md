---
slug: signals-for-everyone
authors: [vr]
tags: [signal, introduction]
---

# Get ready ! Signals for everyone.

Heard about Angular's signals, and want to play with them in any projet ?

Well, you're at the right place !

<br/>


<p align="center">

  ![illustration](./images/undraw_version_control_re_mg66.svg)

</p>


## Introduction

If you've followed the recent javascript trends, you've probably heard about Signals.

Else, don't worry I'll recap quickly:

> A *Signal* is a wrapper around a value that **can notify interested consumers when that value changes**.
Signals can contain any value, from simple primitives to complex data structures.

Adopting Signals, will usually **greatly simplify the design** of your applications: if you have variables depending on other variables (computed),
variables that mutates other time (updated) or large state management (ak: `Store`).

In addition, using Signals to hold dynamic values is easier that managing them yourself: updating manually your computed variables requires more code and quickly becomes error-prone,
where Signals handle it automatically, with a short and elegant syntax.

Other front-end frameworks provide something similar:

- `Angular` recently [introduced Signals](https://angular.io/guide/signals).
- `React` uses `useState` which is similar.
- `Vue`  or `Svelte` have their own internal implementation of such Signals.

So it's something truly essential in the front-end framework ecosystem.

Thus, I've created my own implementation of Signals specially optimized for Reactive Programming and working in any javascript runtime: [@lirx/core](/docs/documentation/signals/introduction/).
This library follows the Angular Signals' API for compatibility, with little differences, but uses a totally different implementation.
**Is not tied to any specific framework**, and can be used in any project.

> This project aims to give to everyone the opportunity to use Signals and learn Reactive Programming,
> by giving to developers universal tools to build complex applications.


It's not restricted to Angular, but it has a close API, in consequence the following part comes directly
from the [Angular Signals' tutorial page]((https://angular.io/guide/signals)).
If you're already familiar with Signals, you may [jump to the differences](#differences-between-this-library-and-the-angulars-signals).


## Signal

A Signal is created using the `signal` function:

```ts
import { signal } from '@lirx/core';

const count = signal(0);

// signals are getter functions - calling them reads their value.
console.log('The count is: ' + count());
```

To change the value of a writable signal, you can either `.set()` it directly:

```ts
count.set(3);
```

or use the `.update()` operation to compute a new value from the previous one:


```ts
// increment the count by 1.
count.update(value => value + 1);
```

## Computed

A **computed signal** derives its value from other signals. Define one using `computed` and specifying a derivation function:

```ts
import { signal, computed } from '@lirx/core';

const count = signal(0);
const doubleCount = computed(() => count() * 2);
```

This library provides the sames functionalities and optimizations as the Angular's one: computed signals are both lazily evaluated and memoized.

As a result, it's safe to perform computationally expensive derivations in computed signals, such as filtering arrays.

## Effects

Signals are useful because they can notify interested consumers when they change.
An **effect** is an operation that runs whenever one or more signal values change.
You can create an effect with the `effect` function:

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

Effects always run at least once.
When an effect runs, it tracks any signal value reads.
Whenever any of these signal values change, the effect runs again.
Similar to computed signals, effects keep track of their dependencies dynamically, and only track signals which were read in the most recent execution.

## Differences between this library and the Angular's Signals

### Close but not identical

The  Angular Signals' API reflects the constraints of the framework. 
In another hand, `@lirx/core` is not limited to any framework, so any part related to Angular is removed, meaning that the API is not totally identical, but extremely close.
In 99% cases, you won't have to change anything, and it will work right out of the box.

### Faster in some cases

The library is focused on performances, and we have done [benchmarks](/docs/documentation/performances/vs-angular/) to compare both frameworks.
We believe that `effect`s are the most important part of Signals, and, in this specific aspect, `@lirx/core` outperforms Angular by a factor of 8.
Combined with a framework like [@lirx/dom](https://dom.lirx.org/docs/documentation/getting-started/introduction/) (alpha), this promises amazing applications.

### @lirx/core includes Observables

`@lirx/core` includes all the tools for Reactive Programming in a single package.
It's designed to create complex and consistent Reactive Applications (mostly front-end), like a breeze.


## Conclusion

If you've searched for the perfect Reactive Programming library, don't look further: `@lirx/core` is probably the right candidate.
You won't have anymore to update manually your computed/derived variables, you'll be able to reflect their changes immediately,
and you will be able to create complex and optimized data pipelines in just a few lines of code.

All of this working independently of any framework !

It's perfect for front-end application where updating the DOM must be done in a simple and elegant manner, while keeping the application consistent.

Coding in Reactive Programming opens you a whole new world of possibilities.
I hope I have piqued your interest with this presentation.


## About @lirx/core

[@lirx/core](/docs/documentation/getting-started/introduction/) **is a Reactive Programming framework** with a lot of prebuild functions,
clear documentations and many examples to teach you how to become a master of RP.
It allows you to develop complex applications and pipelines that scale easily.
Moreover, it is the [fastest and smallest](/docs/documentation/performances/introduction/)
javascript library for `Reactive Programming`.
So it's a good candidate to start your journey with Observables and Signals.

Feel free to test this library, share it and give your feedbacks.


