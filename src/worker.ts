import { isMainThread, workerData, parentPort } from 'node:worker_threads'

if (isMainThread) {
  throw new Error('Worker should not be main thread')
}

type WorkerData = {
  handler: string
  data: any
}

const { handler, data }: WorkerData = workerData

const handle = eval(handler)
const result = handle(data)

parentPort?.postMessage({
  payload: result,
  result: true,
})
