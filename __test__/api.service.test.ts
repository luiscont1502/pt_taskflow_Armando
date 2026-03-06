import { createTodo, deleteTodo, getTodos, updateTodo } from '@/app/services/api.service'
import { afterEach, describe } from 'node:test'


const mockFetch = (data: unknown, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(data),
  } as unknown as Response)
}

describe('api.service', () => {
  afterEach(() => jest.resetAllMocks())

  describe('getTodos', () => {
    it('retorna lista de todos paginada', async () => {
      const mock = { todos: [{ id: 1, todo: 'Test', completed: false, userId: 1 }], total: 1, skip: 0, limit: 10 }
      mockFetch(mock)
      const result = await getTodos(10, 0)
      expect(result.todos).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/todos?limit=10&skip=0'))
    })

    it('lanza error si la respuesta no es ok', async () => {
      mockFetch({}, false)
      await expect(getTodos(10, 0)).rejects.toThrow('Error fetching todos')
    })
  })

  describe('createTodo', () => {
    it('crea un todo y lo retorna', async () => {
      const mock = { id: 255, todo: 'Nueva tarea', completed: false, userId: 1 }
      mockFetch(mock)
      const result = await createTodo('Nueva tarea')
      expect(result.todo).toBe('Nueva tarea')
      expect(result.completed).toBe(false)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/add'),
        expect.objectContaining({ method: 'POST' })
      )
    })

    it('lanza error si falla', async () => {
      mockFetch({}, false)
      await expect(createTodo('test')).rejects.toThrow('Error creating todo')
    })
  })

  describe('updateTodo', () => {
    it('actualiza un todo correctamente', async () => {
      const mock = { id: 1, todo: 'Editado', completed: true, userId: 1 }
      mockFetch(mock)
      const result = await updateTodo(1, { completed: true })
      expect(result.completed).toBe(true)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        expect.objectContaining({ method: 'PATCH' })
      )
    })

    it('lanza error si falla', async () => {
      mockFetch({}, false)
      await expect(updateTodo(1, { completed: true })).rejects.toThrow('Error updating todo')
    })
  })

  describe('deleteTodo', () => {
    it('elimina un todo correctamente', async () => {
      const mock = { id: 1, todo: 'Test', completed: false, userId: 1, isDeleted: true }
      mockFetch(mock)
      const result = await deleteTodo(1)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        expect.objectContaining({ method: 'DELETE' })
      )
      expect(result.id).toBe(1)
    })

    it('lanza error si falla', async () => {
      mockFetch({}, false)
      await expect(deleteTodo(1)).rejects.toThrow('Error deleting todo')
    })
  })
})
