import { renderHook, act } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { useTodos } from '../app/hooks/useTodos'
import * as apiService from '../app/services/api.service'

jest.mock('../app/services/api.service')
jest.mock('../app/services/indexedDB.service', () => ({
  deleteTodoDB: jest.fn().mockResolvedValue(true),
  updateTodoDB: jest.fn().mockResolvedValue(true),
}))

const mockTodos = [
  { id: 1, todo: 'Tarea 1', completed: false, userId: 1 },
  { id: 2, todo: 'Tarea 2', completed: true, userId: 1 },
]

describe('useTodos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(apiService.getTodos as jest.Mock).mockResolvedValue({
      todos: mockTodos,
      total: 2,
      skip: 0,
      limit: 10,
    })
  })

  it('carga los todos al montar', async () => {
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.todos).toHaveLength(2)
  })

  it('filtra por pendientes correctamente', async () => {
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setFilter('pending'))
    expect(result.current.todos.every((t) => !t.completed)).toBe(true)
  })

  it('filtra por completadas correctamente', async () => {
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setFilter('completed'))
    expect(result.current.todos.every((t) => t.completed)).toBe(true)
  })

  it('filtra por búsqueda en tiempo real', async () => {
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setSearch('Tarea 1'))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].todo).toBe('Tarea 1')
  })

  it('agrega un todo al estado local', async () => {
    const newTodo = { id: 3, todo: 'Nueva', completed: false, userId: 1 }
    ;(apiService.createTodo as jest.Mock).mockResolvedValue(newTodo)
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(() => result.current.addTodo('Nueva'))
    expect(result.current.todos.some((t) => t.todo === 'Nueva')).toBe(true)
  })

  it('elimina un todo del estado local', async () => {
    ;(apiService.deleteTodo as jest.Mock).mockResolvedValue({ id: 1 })
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(() => result.current.removeTodoHandler(1))
    expect(result.current.todos.find((t) => t.id === 1)).toBeUndefined()
  })

  it('toggle actualiza completed en UI inmediatamente', async () => {
    ;(apiService.updateTodo as jest.Mock).mockResolvedValue({ id: 1, completed: true })
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(() => result.current.toggleTodo(1, true))
    const todo = result.current.todos.find((t) => t.id === 1)
    expect(todo?.completed).toBe(true)
  })

  it('muestra error si getTodos falla', async () => {
    ;(apiService.getTodos as jest.Mock).mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useTodos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Error loading todos')
  })
})