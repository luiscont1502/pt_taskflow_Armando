import { useEffect, useState, useCallback } from 'react'
import { Todo } from '../types/todos'
import { deleteTodoDB, updateTodoDB } from '../services/indexedDB.service'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/api.service'
import { arrayMove } from '@dnd-kit/sortable'

const LIMIT = 10

type FilterType = 'all' | 'completed' | 'pending'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTodos(LIMIT, page * LIMIT)
      setTodos(data.todos)
      setTotal(data.total)
    } catch {
      setError('Error loading todos')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = async (text: string): Promise<void> => {
  const newTodo = await createTodo(text)
  // DummyJSON siempre devuelve id:255, generamos uno único local
  const uniqueTodo = {
    ...newTodo,
    id: Date.now(), // ID único basado en timestamp
  }
  setTodos((prev) => [uniqueTodo, ...prev])
}

  /**
   * actualizamos la UI inmediatamente.
   * No revertimos si falla porque puede ser una tarea local con ID > 150
   * que no existe en DummyJSON.
   */
  const toggleTodo = async (id: number, completed: boolean): Promise<void> => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
    )
    try {
      await updateTodo(id, { completed })
    } catch {
      console.log("Error en toggleTodo");
      // Tarea local — mantenemos el cambio en UI
    }
  }

  /**
   * Edita el texto. DummyJSON no persiste el texto ni acepta IDs > 150,
   * por eso actualizamos solo localmente si la API falla.
   */
  const editTodo = async (id: number, newText: string): Promise<void> => {
    const previous = todos.find((t) => t.id === id)
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, todo: newText } : todo))
    )
    try {
      await updateTodo(id, { todo: newText })
      if (previous) await updateTodoDB({ ...previous, todo: newText })
    } catch {
      if (previous) await updateTodoDB({ ...previous, todo: newText }).catch(() => null)
    }
  }

  const removeTodoHandler = async (id: number): Promise<void> => {
    try {
      await deleteTodo(id)
      await deleteTodoDB(id)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch {
      setError('Error al eliminar la tarea')
    }
  }

  // Reordenar con drag & drop (solo estado local)
  const reorderTodos = (activeId: number, overId: number) => {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === activeId)
      const newIndex = prev.findIndex((t) => t.id === overId)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  // Filtro + búsqueda aplicados sobre los todos
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'completed' ? todo.completed :
      filter === 'pending' ? !todo.completed : true
    const matchesSearch = todo.todo.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(total / LIMIT)

  return {
    todos: filteredTodos,
    loading,
    error,
    page,
    setPage,
    totalPages,
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
  }
}