import { isAsyncFunction } from 'util/types';
import { workerData, parentPort, Worker, isMainThread } from 'worker_threads';

/**
 *
 * Return a modified version of a CPU intensive
 * function, which will run in a worker thread when invoked
 *
 * Example : Creating a worker thread to find fibonacci number
 * ```js
 * // fibonacci-worker.ts
 * import { createWorker } from 'worker-man';
 *
 * // A CPU intensive fibonacci implementation
 * export function cpuHeavyFindFibonacci(n){
 *   if (n < 2) return 1;
 *   else return cpuHeavyFindFibonacci(n - 2) + cpuHeavyFindFibonacci(n - 1);
 * }
 *
 * export const findFibonacci = createWorker(__filename, cpuHeavyFindFibonacci);
 *
 * // main.ts
 * import { findFibonacci } from './fibonacci-worker.ts'
 *
 * const main = async () => {
 *  const fibonacci = await findFibonacci(200); // Here `findFibonacci` will be run in a worker thread
 *  console.log(fibonacci);
 * }
 * ```
 *
 * @param fileName The path to the file in which worker thread is created
 * @param heavyFunction The CPU intensive function which needs to be parallelized
 */
export function createWorker<
  T extends (...args: any) => any | Promise<any>,
  R extends ReturnType<T>,
>(fileName: string | URL, heavyFunction: T): (...args: Parameters<T>) => Promise<Awaited<R>> {
  // If called from worker thread, run the heavyFunction and post result to parent
  if (!isMainThread) {
    if (isAsyncFunction(heavyFunction))
      heavyFunction(workerData).then((result: R) => parentPort?.postMessage(result));
    else parentPort?.postMessage(heavyFunction(workerData));

    // @ts-ignore: Type check is only needed for main thread
    return undefined;
  }

  // If called from main thread, return a function to consume the worker
  return function workerFunction(...args: Parameters<T>) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(fileName, { workerData: args });
      worker.on('message', (result) => resolve(result));
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker Thread stopped with the exit code: ${code}`));
      });
    });
  };
}
