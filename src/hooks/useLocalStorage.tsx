import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

type StorageOperation = 'read' | 'write' | 'remove'
type ParserOptions<T> = ({ raw: true } | {
  raw?: false
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
}) & {
  onError?: (error: unknown, operation: StorageOperation) => void
}

export default function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  options?: ParserOptions<T>,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {
  const config = useRef({ key, initialValue, options })
  config.current = { key, initialValue, options }

  const read = () => {
    try {
      const stored = localStorage.getItem(key)
      const value = stored === null
        ? initialValue
        : options?.raw ? stored as T : (options?.deserializer ?? JSON.parse)(stored) as T
      return { key, value, missing: stored === null, error: undefined as unknown }
    }
    catch (error) {
      return { key, value: initialValue, missing: false, error }
    }
  }

  const [snapshot, setSnapshot] = useState(read)
  const current = useRef(snapshot)
  const persist = useCallback((value: T | undefined) => {
    const { key, options } = config.current
    try {
      if (value === undefined) {
        localStorage.removeItem(key)
      }
      else {
        const encoded = options?.raw ? String(value) : (options?.serializer ?? JSON.stringify)(value)
        localStorage.setItem(key, encoded)
      }
    }
    catch (error) {
      options?.onError?.(error, value === undefined ? 'remove' : 'write')
    }
  }, [])

  useLayoutEffect(() => {
    if (current.current.key !== key) {
      current.current = read()
      setSnapshot(current.current)
    }
    if (current.current.error)
      config.current.options?.onError?.(current.current.error, 'read')
    if (current.current.missing) {
      current.current.missing = false
      if (current.current.value !== undefined)
        persist(current.current.value)
    }
  }, [key, persist])

  const set: Dispatch<SetStateAction<T | undefined>> = useCallback((valueOrUpdater) => {
    const value = typeof valueOrUpdater === 'function'
      ? (valueOrUpdater as (previous: T | undefined) => T | undefined)(current.current.value)
      : valueOrUpdater
    const next = { key: config.current.key, value, missing: false, error: undefined }
    current.current = next
    setSnapshot(next)
    persist(value)
  }, [persist])
  const remove = useCallback(() => set(undefined), [set])

  return [snapshot.value, set, remove]
}
