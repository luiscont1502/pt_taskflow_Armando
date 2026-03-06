'use client'

import { useState } from 'react'

interface EditDialogProps {
  currentText: string
  onConfirm: (newText: string) => void
  onCancel: () => void
}

export function EditDialog({ currentText, onConfirm, onCancel }: EditDialogProps) {
  const [text, setText] = useState(currentText)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || text.trim() === currentText) {
      onCancel()
      return
    }
    onConfirm(text.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Editar tarea</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-black mb-4"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}