# Performances

📈 Zero classes ! **Purely based on functions**.
This allows extremely **efficient optimizations** from the bundler, the minifier and the js engine, both in size and execution time.

🪣 Fully **tree-shakable**: bundle only what's your using and nothing more.

💪 **Well optimized**, with efficient garbage collection, fast data flow, and freed resources.

<p align="center">
⚙️⚙️⚙️
</p>


`@lirx/core` is **extremely performant** because it relies only on pure functions:

- functions are parts of the javascript language, and they are perfectly well optimized by the vendor engines.
- functions minification is very efficient and, in many cases, they are unrolled and simplified.

For large projects or browser applications requiring critical performances and reactive programming,
`@lirx/core` is an excellent solution, and a good alternative to `rxjs`.


:::note

The following performances tests are not exhaustive, but they cover some generic and frequent usages of Observables.
They are not tweaked in favour of `@lirx/core` and in disfavor of `rxjs`. They try to be as fair as possible,
and show how this lib performs against `rxjs`.
Feel free to share your own tests, as it helps `@lirx/core` to find the fastest possible implementations.

:::



---

**SYSTEM CONFIGURATION:**

- CPU: Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz (6 cores / 12 threads)
- Memory: 16Go
- OS: Ubuntu 20.04 LTS
- Browser: Chrome 109
- Date: 2023-01-26
- LiRX/core: 1.2.0

---

## Example 1

This first example compare the 3 most common and used pipes: `map`,  `filter` and `distinctUntilChanged`.


|           |  rxjs   | @lirx/core |     ratio     |
|:---------:|:-------:|:----------:|:-------------:|
|    time   | 1250ms  |   247ms    |   5x faster   |
|    size   | 12.02kb |   0.50kb   |  24x smaller  |
| (gzipped) | 4.27kb  |   0.29kb   | 14.7x smaller |

As you may see, `@lirx/core` strongly outperforms `RxJS` in both execution time and bundle size.
And due to its capabilities, you may use it in any of your projects with almost zero footprint.
Let's note however, that `RxJS` did an amazing job this past years, as they went from 20x slower a few years ago at 5x slower for the same test code.


<details>
  <summary>Expand the code</summary>


```ts
import { from as fromRXJS } from 'rxjs';
import { fromArray, distinct$$$, map$$$, pipe$$, filter$$$ } from '@lirx/core';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

function performancesExample() {
  const values = Array.from({ length: 1e5 }, (v: any, index: number) => index);

  const withRXJS = () => {
    let j = 0;

    const obs = fromRXJS(values).pipe(
      map((value: number) => value * 2),
      filter((value: number) => value > 1e4),
      distinctUntilChanged()
    );

    console.time('start');
    for (let i = 0; i < 1e2; i++) {
      obs.subscribe((value: number) => {
        j += value;
      });
    }
    console.timeEnd('start');
    console.log('j', j);
  };

  const withLiRXCore = () => {
    let j = 0;

    const subscribe = pipe$$(fromArray(values), [
      map$$$<number, number>((value: number) => value * 2),
      filter$$$<number>((value: number) => value > 1e4),
      distinct$$$<number>(),
    ]);

    console.time('start');
    for (let i = 0; i < 1e2; i++) {
      subscribe((value: number) => {
        j += value;
      });
    }
    console.timeEnd('start');
    console.log('j', j);
  };

  /* RxJS */

  // withRXJS();

  // time:
  //  1250.388916015625 ms

  // size:
  //  dist/assets/index.412ad1ea.js   12.02 KiB / gzip: 4.27 KiB

  /* @lirx/core */

  withLiRXCore();

  // time:
  //  247.414794921875 ms
  //  => 5x faster

  // size:
  //  dist/assets/index.6d7778f7.js   0.50 KiB / gzip: 0.29 KiB
  //  => 24x / 14.7x smaller
}

performancesExample();
```

</details>

[Click here to run the code](https://stackblitz.com/edit/vite-ud1q9a?file=main.ts)

---

## Example 2

This example focuses more on the notifications, and the performances associated with them.

|           |  rxjs  | @lirx/core <br/> (with notification) | ratio         | @lirx/core <br/> (without notification) |     ratio      |
|:---------:|:------:|:------------------------------------:|---------------|:----------------------------------:|:--------------:|
|    time   | 3713ms |                2379ms                | 1.56x faster  |               1112ms               | 3.3x faster    |
|    size   | 14.3kb |                1.37kb                | 10.4x smaller |               0.56kb               | 25.5x smaller  |
| (gzipped) | 4.95kb |                0.66kb                | 7.5x smaller  |               0.32kb               | 15.4x smaller  |



This time, `RxJS` performs pretty well. It has been built for Observables having *states*.
So it is finely tuned for these cases. `@lirx/core` is the winner, but by little (~30% less time).
However, if we rewrite the pipeline to work without Notifications, we may see than `@lirx/core` takes the lead.

Through this example, we may see that it's pretty important to select the right Observable and pipeline, as it could easily double our performances.

<details>
  <summary>Expand the code</summary>

```ts
import { of as ofRXJS, forkJoin as forkJoinRXJS } from 'rxjs';
import {
  forkJoin,
  singleN,
  fulfilled$$$,
  pipe$$,
  defaultNotificationObserver,
  combineLatest,
  map$$,
  single,
} from '@lirx/core';
import { map } from 'rxjs/operators';

function performancesExample() {
  const length: number = 1e3;
  const iterations: number = 1e4;

  const sum = (values: readonly number[]): number => {
    let sum: number = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
    }
    return sum;
  };

  const withRXJS = () => {
    let j = 0;

    const obs = forkJoinRXJS(
      Array.from({ length }, (_, i) => ofRXJS(Math.random()))
    ).pipe(map(sum));

    console.time('start');

    for (let i = 0; i < iterations; i++) {
      obs.subscribe((value: number) => {
        j += value;
      });
    }

    console.timeEnd('start');
    console.log('j', j);
  };

  const withLiRXCoreAndNotifications = () => {
    let j = 0;

    const subscribe = pipe$$(
      forkJoin(
        Array.from({ length }, (_, i) => singleN<number>(Math.random()))
      ),
      [
        fulfilled$$$((values: number[]) => {
          return singleN(sum(values));
        }),
      ]
    );

    console.time('start');

    for (let i = 0; i < iterations; i++) {
      subscribe(
        defaultNotificationObserver((value: number) => {
          j += value;
        })
      );
    }
    console.timeEnd('start');
    console.log('j', j);
  };

  const withLiRXCore = () => {
    let j = 0;

    const subscribe = map$$(
      combineLatest(Array.from({ length }, (_, i) => single(Math.random()))),
      sum
    );

    console.time('start');

    for (let i = 0; i < iterations; i++) {
      subscribe((value: number) => {
        j += value;
      });
    }
    console.timeEnd('start');
    console.log('j', j);
  };

  /* RxJS */

  // withRXJS();

  // time:
  //  3713.386962890625 ms

  // size:
  //  dist/assets/index.e05384e3.js   14.30 KiB / gzip: 4.95 KiB

  /* @lirx/core */

  // withLiRXCoreAndNotifications();

  // time:
  //  2379.6220703125 ms
  //  => 1.56x faster

  // size:
  //  dist/assets/index.5ca1e5d4.js   1.37 KiB / gzip: 0.66 KiB
  //  => 10.4x / 7.5x smaller

  withLiRXCore();

  // time:
  //  1112.876953125 ms
  //  => 3.3x faster

  // size:
  //  dist/assets/index.d50e09c0.js   0.56 KiB / gzip: 0.32 KiB
  //  => 25.5x / 15.4x smaller
}

performancesExample();
```

</details>

[Click here to run the code](https://stackblitz.com/edit/vite-dvfy5w?file=main.ts)

