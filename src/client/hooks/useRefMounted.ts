import { MutableRefObject,useEffect, useRef } from 'react'

const useRefMounted = (): MutableRefObject<boolean> => {
  const isRef = useRef(true)

  useEffect(
    () => (): void => {
      isRef.current = false
    },
    []
  )

  return isRef
}

export default useRefMounted
