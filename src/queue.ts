export const createQueue = <T>(data?: T[]) => {
  const _queue: { [K in number]: T } = {}
  const _boundary = {
    head: 0,
    tail: 0,
  }

  const enqueue = (e: T) => {
    _queue[_boundary.tail] = e
    _boundary.tail++
  }

  const dequeue = (): T => {
    const e = _queue[_boundary.head]
    delete _queue[_boundary.head]
    _boundary.head++
    return e
  }

  const peek = (): T => _queue[_boundary.head]

  const length = (): number => _boundary.tail - _boundary.head

  const isEmpty = () => length() === 0

  data?.forEach(enqueue)

  return {
    enqueue,
    dequeue,
    peek,
    length,
    isEmpty,
  }
}
