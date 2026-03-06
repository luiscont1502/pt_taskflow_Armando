'use client'

import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from '../types/todos'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 px-3 py-3 rounded-xl"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="touch-none select-none text-lg leading-none cursor-grab active:cursor-grabbing"
        style={{ color: 'rgba(255,255,255,0.2)' }}
        aria-label="Arrastrar"
      >
        ⠿
      </button>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        className="w-4 h-4 rounded cursor-pointer accent-yellow-400"
      />

      {/* Texto */}
      <span
        className="flex-1 text-sm"
        style={{
          color: todo.completed ? 'rgba(255,255,255,0.3)' : '#f1f5f9',
          textDecoration: todo.completed ? 'line-through' : 'none',
        }}
      >
        {todo.todo}
      </span>

      {/* Acciones */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(todo)}
          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{ background: '#003893', color: '#fff' }}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{ background: 'rgba(255,0,0,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,0,0,0.2)' }}
        >
          Eliminar
        </button>
      </div>
    </motion.li>
  )
}