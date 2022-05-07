import React, { Dispatch, SetStateAction,useCallback,useLayoutEffect,useRef, useState } from 'react'
const noop = () => { };
type parserOptions<T> =
  | { raw: true }
  | {
    raw: false,
    serializer: (value: T) => string
    deserializer: (value: string) => T
  }
/**TODO 序列化存储的方式 改变 */
export default function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  options?: parserOptions<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {

  //判断是不是浏览器环境
  if (typeof window === 'undefined') {
    return [initialValue, noop, noop]
  }
  //判断有没有传入key
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  //反序列化,将字符串转换为对象
  const deserializer = options
    ? options.raw
      ? (value: string) => value
      : options.deserializer
    : JSON.parse


  //序列化
  const initializer = useRef((key: string) => {
    try{
      const serializer = options ? ( options.raw ? String : options.serializer ) : JSON.stringify

      const localStorageValue = localStorage.getItem(key)
      if(localStorageValue !== null) {
        return deserializer(localStorageValue)
      } else {
        initialValue && localStorage.setItem(key, serializer(initialValue))

        return initialValue
      }
    } catch {
      //
      return initialValue
    }
  })


  const [state, setState] = useState<T | undefined>(() => initializer.current(key))

  useLayoutEffect(() => setState(initializer.current(key)),[key])

  const set: Dispatch<SetStateAction<T | undefined>> = useCallback((valOrFunc) => {
    try{
      const newState = typeof valOrFunc === 'function' ? (valOrFunc as Function)(state) : valOrFunc
      if(typeof newState === 'undefined') return

      let value: string
      //l
      if(options)
        if(options.raw)
          if(typeof newState === 'string') value = newState
          else value = JSON.stringify(newState)
        else if (options.serializer) value = options.serializer(newState)
        else value = JSON.stringify(newState)
      else value = JSON.stringify(newState)

      localStorage.setItem(key, value)
      setState(deserializer(value))
    } catch {

    }

  },[key, setState])

  const remove = useCallback(() => {
    try{
      localStorage.removeItem(key)
      setState(undefined)
    } catch {

    }
  },[key, setState])


  return [state, set,remove]
}
