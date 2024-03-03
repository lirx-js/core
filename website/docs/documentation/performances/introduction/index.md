# Introduction

`@lirx/core` highly focuses on performances. We benchmark our code and run tests to satisfy that everything:
runs as fast as possible,
generates the smallest bundle,
and has a very small footprint.
All of this, having a simple and elegant API.
This ensures it can be embedded with confidence in any projet, increasing code readability, reducing bugs, and boosting performances in many situations.


---

📈 Zero classes! **Purely based on functions**.
This allows extremely **efficient optimizations** by the bundler, the minifier and the js engine, both in size and execution time.

🪣 Fully **tree-shakable**: bundle only what you are using and nothing more.

💪 **Well optimized**, with efficient garbage collection, fast data flow, and freed resources.

⚔️ **Battle tested**: performances are analysed to fine tune the code, and tests are run to ensure consistency.

<p align="center">
⚙️⚙️⚙️
</p>


`@lirx/core` is **extremely performant** because it relies only on pure functions:

- functions are parts of the javascript language, and they are perfectly well optimized by the vendor engines.
- functions minification is very efficient and, in many cases, they are unrolled and simplified.

For large projects or browser applications requiring critical performances and reactive programming,
`@lirx/core` is an excellent solution, and a good alternative to `rxjs`.


---

:::note

The following performances tests are not exhaustive, but they cover what we think are generic and frequent usages of Observables or Signals.
They cover complex cases reflecting many aspects and usages of the different tools, highlighting the strengths and weakness of each solution.

We did not tweak them in favour of any framework: we try to be as fair and close as possible,
showing how this lib performs against other solutions.
It's critical to us, as we want to improve continuously the lib, getting the absolute best performances in any situation.
Thus, *artifice* is not an option.

However, we can't be perfect. In consequence, feel free to share your own tests.
We'll be really grateful, as it helps `@lirx/core` to aim for the fastest possible implementation.

Finally, keep in mind that benchmarks are approximations too, and may vary from a computer to another one.

:::
