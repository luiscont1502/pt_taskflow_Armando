'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useTodos } from './hooks/useTodos'
import { Todo } from './types/todos'
import { useToast } from './components/Usetoast'
import { TodoSkeleton } from './pages/TodoSkeleton'
import { EmptyState } from './pages/EmptyState'
import { TodoItem } from './pages/TodoItem'
import { Toast } from './components/Toast'
import { EditDialog } from './components/Editdialog'
import { ConfirmDialog } from './components/Confirmdialog'

export default function Home() {
  const {
    todos,
    loading,
    error,
    page,
    totalPages,
    setPage,
    filter,
    setFilter,
    search,
    setSearch,
    fetchTodos,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodoHandler,
    reorderTodos,
  } = useTodos()

  const { toast, showToast, hideToast } = useToast()
  const [newTodo, setNewTodo] = useState('')
  const [confirm, setConfirm] = useState<{ id: number } | null>(null)
  const [editing, setEditing] = useState<Todo | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderTodos(active.id as number, over.id as number)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!newTodo.trim()) return
  try {
    await addTodo(newTodo)
    setNewTodo('')
    showToast('Tarea creada correctamente', 'success')
    // NO debe haber fetchTodos() aquí
  } catch {
    showToast('Error al crear la tarea', 'error')
  }
}

  const handleEditConfirm = async (newText: string) => {
    if (!editing) return
    try {
      await editTodo(editing.id, newText)
      showToast('Tarea editada correctamente', 'success')
    } catch {
      showToast('Error al editar la tarea', 'error')
    } finally {
      setEditing(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!confirm) return
    try {
      await removeTodoHandler(confirm.id)
      showToast('Tarea eliminada', 'success')
    } catch {
      showToast('Error al eliminar la tarea', 'error')
    } finally {
      setConfirm(null)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>

      {/* Franja tricolor Ecuador */}
      <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #FFD100 33.33%, #003893 33.33%, #003893 66.66%, #FF0000 66.66%)' }} />

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1
            className="text-4xl font-black tracking-tight mb-1"
            style={{ color: '#FFD100', fontFamily: 'Georgia, serif', textShadow: '0 2px 16px rgba(255,209,0,0.4)' }}
          >
            TaskFlow
          </h1>
          <p className="text-sm" style={{ color: '#94a3b8' }}>Gestiona tus tareas con estilo</p>
        </motion.div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
        >
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9' }}
              placeholder="Nueva tarea..."
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: '#FFD100', color: '#1a1a2e' }}
            >
              + Agregar
            </button>
          </form>

          {/* Búsqueda */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-sm outline-none mb-4"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
            placeholder="🔍 Buscar tarea..."
          />

          {/* Filtros */}
          <div className="flex gap-2 mb-5">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  filter === f
                    ? { background: '#FFD100', color: '#1a1a2e' }
                    : { background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }
                }
              >
                {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)' }}>
              <p className="text-red-400 text-sm">{error}</p>
              <button onClick={fetchTodos} className="text-xs underline text-red-300 mt-1">Reintentar</button>
            </div>
          )}

          {/* Lista */}
          {loading ? (
            <TodoSkeleton />
          ) : todos.length === 0 ? (
            <EmptyState />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  <AnimatePresence>
                    {todos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onEdit={(t) => setEditing(t)}
                        onDelete={(id) => setConfirm({ id })}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </SortableContext>
            </DndContext>
          )}

          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ← Anterior
            </button>
            <span className="text-xs" style={{ color: '#64748b' }}>
              Página {page + 1} de {totalPages || 1}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Dialogs */}
      {editing && <EditDialog currentText={editing.todo} onConfirm={handleEditConfirm} onCancel={() => setEditing(null)} />}
      {confirm && <ConfirmDialog message="¿Eliminar esta tarea?" onConfirm={handleDeleteConfirm} onCancel={() => setConfirm(null)} />}
    </main>
  )
}