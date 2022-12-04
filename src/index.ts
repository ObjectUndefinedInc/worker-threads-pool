import { isMainThread } from 'node:worker_threads'
import { createWorker, WorkerResult } from './worker-wrapper'

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
]

const promises: Promise<WorkerResult<number>>[] = []

for (let i = 0; i < data.length; i++) {
  promises.push(createWorker(i, findMax, data[i]))
}

Promise.all(promises)
  .then(res => {
    console.log('>>> All results from all workers', res)
    const mappedResults = res.map(r => r.payload)

    const maxFromResult = findMax(mappedResults)
    console.log('>>> maxFromResult', maxFromResult)

    return maxFromResult
  })
  .catch(err => console.error('>>> Received Error', err))
