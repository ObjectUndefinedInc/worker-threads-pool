import { createQueue } from './queue'
import { createWorker } from './worker-wrapper'

type PoolParams<TTask, TResult> = {
  handler: (task: TTask) => TResult
  tasks: TTask[]
  opts: {
    threads: number
    tolerateErrors?: boolean
    onResult?: (res: TResult) => void
    onError?: (err: any) => void
    onDone?: (res: TResult[]) => void
  }
}

export const createPool = <TTask, TResult>({
  handler,
  tasks,
  opts,
}: PoolParams<TTask, TResult>) => {
  const { threads, tolerateErrors, onResult, onError } = opts

  let _isRunning = false
  let _finishedTasks = 0

  let _currentWorkerId = 0

  const _queue = createQueue(tasks)
  const _workers = new Set<number>()
  const _result: TResult[] = []

  let _resolve: (res: TResult[] | PromiseLike<TResult[]>) => void
  let _reject: (err: any) => void

  const start = async () => {
    if (_isRunning) {
      throw new Error('Pool is already running')
    }
    if (_finishedTasks === tasks.length) {
      throw new Error('Pool has already finished')
    }
    _isRunning = true

    const promise = new Promise<TResult[]>((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    allocate()
    return promise
  }

  const allocate = () => {
    if (_queue.isEmpty()) {
      return
    }

    const spawnAmount = threads - _workers.size

    if (spawnAmount > 0) {
      for (let i = 0; i < spawnAmount; i++) {
        const task = _queue.dequeue()
        const workerId = _currentWorkerId++

        const worker = createWorker(workerId, handler, task)
        _workers.add(workerId)

        worker
          .then(res => {
            _workers.delete(workerId)
            _result.push(res.payload)
            onResult?.(res.payload)
          })
          .catch(err => {
            _workers.delete(workerId)
            onError?.(err)
            if (!tolerateErrors) {
              _reject(err)
            }
          })
          .finally(() => {
            if (++_finishedTasks === tasks.length) {
              _isRunning = false
              _resolve(_result)
            } else {
              allocate()
            }
          })
      }
    }
  }

  return {
    start,
  }
}
