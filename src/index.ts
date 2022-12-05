import { isMainThread } from 'node:worker_threads'
import { createPool } from './pool'
// import { createWorker, WorkerResult } from './worker-wrapper'

if (!isMainThread) {
  throw new Error('Index should be main thread')
}

const threadCount = +process.argv[2] || 2
console.log({ threadCount })

const findMax = (input: number[]) => Math.max(...input)

const data = [
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
  [0, 2, 1],
  [3, 5, 4],
  [6, 8, 7],
  [9, 11, 10],
]

const pool = createPool({
  handler: findMax,
  tasks: data,
  opts: {
    threads: threadCount,
  },
})

pool.start().then(console.log)
