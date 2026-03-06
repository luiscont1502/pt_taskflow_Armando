import { useState, useCallback } from 'react'

interface ToastData {
  message: string
  type: 'success' | 'error'
  id: number
}

type ToastState = ToastData | null

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return { toast, showToast, hideToast }
}