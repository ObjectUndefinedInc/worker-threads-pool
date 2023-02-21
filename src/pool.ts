import { PoolParams } from '.'
import { createQueue } from './queue'
import { createWorker } from './worker-wrapper'

export const createPool = <TTask, TResult>({
  handler,
  tasks,
  opts,
}: PoolParams<TTask, TResult>) => {
  const { threads, tolerateErrors, onResult, onError } = opts

  let _isRunning = false
  let _finishedTasks = 0

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

  const allocate = () =>
    setImmediate(() => {
      if (_queue.isEmpty()) {
        return
      }

      const spawnAmount = threads - _workers.size

      if (spawnAmount > 0) {
        for (let i = 0; i < spawnAmount; i++) {
          const task = _queue.dequeue()
          if (!task) {
            return
          }

          const worker = createWorker(handler, task)
          _workers.add(worker.id)

          worker.result
            .then(res => {
              _result.push(res.payload)
              onResult?.(res.payload)
            })
            .catch(err => {
              onError?.(err)
              if (!tolerateErrors) {
                _reject(err)
              }
            })
            .finally(() => {
              _workers.delete(worker.id)

              setImmediate(() => worker.destroy())
              if (++_finishedTasks === tasks.length) {
                _isRunning = false
                _resolve(_result)
              } else {
                allocate()
              }
            })
        }
      }
    })

  return {
    start,
  }
}
