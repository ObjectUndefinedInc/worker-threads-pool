import { Worker } from 'node:worker_threads'

export type WorkerResult<T> = {
  id: string | number
  payload: T
  result: boolean
}

const stringifyHandler = (fn: Function): string => {
  const ES6_FUNC_REGEXP = /^task[^]*([^]*)[^]*{[^]*}$/,
    strFn = Function.prototype.toString.call(fn),
    isES6 = ES6_FUNC_REGEXP.test(strFn),
    result = isES6 ? 'function ' + strFn : strFn
  return `(${result})`
}

export const createWorker = <TData, TResult>(
  id: string | number,
  handler: (data: TData) => TResult,
  data: TData
) =>
  new Promise<WorkerResult<TResult>>((resolve, reject) => {
    const workerData = {
      id,
      handler: stringifyHandler(handler),
      data,
    }

    const worker = new Worker('./build/worker.js', { workerData })
    worker.on('message', (m: WorkerResult<TResult>) => resolve(m))
    worker.on('error', err => reject(err))
  })
