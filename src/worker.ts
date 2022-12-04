import { isMainThread, workerData, parentPort } from 'node:worker_threads'

if (isMainThread) {
  throw new Error('Worker should not be main thread')
}

type WorkerData = {
  id: string | number
  handler: string
  data: any
}

const { id, handler, data }: WorkerData = workerData
console.log(`::: Worker ${id} processing data`)

const handle = eval(handler)
const result = handle(data)

parentPort?.postMessage({
  id,
  payload: result,
  result: true,
})
