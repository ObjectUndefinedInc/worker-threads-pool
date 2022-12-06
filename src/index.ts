import { isMainThread } from 'node:worker_threads'
import { createPool } from './pool'

if (!isMainThread) {
  throw new Error('Index should be main thread')
}

const threadCount = +process.argv[2] || 12
console.log({ threadCount })

const findMax = (input: number[]) => {
  const noop = () => {
    for (let i = 0; i < 30e8; i++) {}
  }

  for (const _ of input) {
    noop()
  }
  return Math.max(...input)
}

const data = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29],
  [30, 31, 32, 33, 34],
  [35, 36, 37, 38, 39],
  [40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49],
  [50, 51, 52, 53, 54],
  [55, 56, 57, 58, 59],
]

const startTime = performance.now()

// const allMaxes = data.map(findMax)
// const _ = findMax(allMaxes)
// console.log({ max })

const pool = createPool({
  handler: findMax,
  tasks: data,
  opts: {
    threads: threadCount,
  },
})

pool.start().then(_ => {
  const endTime = performance.now()
  console.log('it took', endTime - startTime, 'ms')
})
