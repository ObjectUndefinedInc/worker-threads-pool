export declare function createPool<TTask, TResult>(
  params: PoolParams<TTask, TResult>
): {
  start: () => Promise<TResult[]>
}

export declare type PoolParams<TTask, TResult> = {
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
