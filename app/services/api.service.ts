import { http } from '../common/HttpClientCommon'
import { Todo, TodosResponse } from '../types/todos'

export const getTodos = (limit: number, skip: number): Promise<TodosResponse> =>
  http.get(`/todos?limit=${limit}&skip=${skip}`)

export const createTodo = (text: string): Promise<Todo> =>
  http.post('/todos/add', { todo: text, completed: false, userId: 1 })

export const updateTodo = (id: number, fields: Partial<Pick<Todo, 'completed' | 'todo'>>): Promise<Todo> =>
  http.patch(`/todos/${id}`, fields)

export const deleteTodo = (id: number): Promise<Todo> =>
  http.delete(`/todos/${id}`)