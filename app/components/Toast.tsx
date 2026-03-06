'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Entrada con animación
    setTimeout(() => setVisible(true), 10)

    // Auto-cerrar después de 3s
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // esperar animación de salida
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
    >
      <span className="text-lg">{type === 'success' ? '✓' : '✕'}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 opacity-70 hover:opacity-100 transition"
      >
        ✕
      </button>
    </div>
  )
}