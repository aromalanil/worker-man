# 👷‍♂️ Worker Man 

[![NPM Version](https://img.shields.io/npm/v/worker-man)](https://www.npmjs.com/package/worker-man)
![ESLint Check](https://github.com/aromalanil/worker-man/workflows/ESLint-Check/badge.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/aromalanil/worker-man/blob/master/LICENSE)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/worker-man)](https://www.npmjs.com/package/worker-man)

[![https://nodei.co/npm/worker-man.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/worker-man.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/worker-man)

`worker-man` is a lightweight and easy-to-use package for distributing CPU-intensive operations in Node.js.

This package let's you convert a CPU heavy functions into an async functions, which will run in a worker thread on invocation, it's that simple

## Installation 

```bash
# If you use npm:
npm install worker-man

# Or if you use Yarn:
yarn add worker-man
```

## Online Playground
Use the button below to play with a small demo project to help familiarize with Worker Man.

[![View on Codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/eloquent-gould-0szwss)

## Usage
Here's a basic example of how to use `worker-man`.

1. Create a new file and define your CPU intensive function in it. 
2. Call `createWorker` with the `__filename` as first argument and the function you have defined as the second argument.

> fibonacci-worker.js
```js
import { createWorker } from 'worker-man';

 // A CPU intensive fibonacci implementation
 export function cpuHeavyFindFibonacci(n){
   if (n < 2) return 1;
   else return cpuHeavyFindFibonacci(n - 2) + cpuHeavyFindFibonacci(n - 1);
 }

 export const findFibonacci = createWorker(__filename, cpuHeavyFindFibonacci);
```
3. Save the return value of `createWorker`, which will be an `async` function that you can use anywhere in your codebase.

> main.js
```js
import { findFibonacci } from './fibonacci-worker.ts'
const main = async () => {
 const fibonacci = await findFibonacci(200); // Here `findFibonacci` will be run in a worker thread
 console.log(fibonacci);
}
```

In the above example `findFibonacci` will be run in a worker thread

## API
### createWorker(filename, workerFunction)
Returns a function that can be used to execute the workerFunction in a separate thread.

### Arguments
- filename (string): The absolute path of the file that creates the worker.
- workerFunction (function): The function to be executed in the worker thread.
### Return value
A function that returns a Promise which resolves to the result of workerFunction.

## Author
[Aromal Anil](https://aromalanil.in)

## License
Worker Man is [MIT licensed](https://github.com/aromalanil/worker-man/blob/master/LICENSE).
