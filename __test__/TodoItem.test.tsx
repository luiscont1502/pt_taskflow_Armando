import '@testing-library/jest-dom'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Todo } from '../app/types/todos'
import { TodoItem } from '@/app/pages/TodoItem'

jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))
jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}))
jest.mock('framer-motion', () => ({
  motion: {
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement> & { children: React.ReactNode }) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockTodo: Todo = { id: 1, todo: 'Tarea de prueba', completed: false, userId: 1 }

describe('TodoItem', () => {
  const onToggle = jest.fn()
  const onEdit = jest.fn()
  const onDelete = jest.fn()

  beforeEach(() => jest.clearAllMocks())
  afterEach(() => cleanup())

  it('renderiza el texto de la tarea', () => {
    const { getByText } = render(<TodoItem todo={mockTodo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)
    expect(getByText('Tarea de prueba')).toBeInTheDocument()
  })

  it('muestra checkbox desmarcado si no está completada', () => {
    const { getByRole } = render(<TodoItem todo={mockTodo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)
    expect(getByRole('checkbox')).not.toBeChecked()
  })

  it('muestra checkbox marcado si está completada', () => {
    const { getByRole } = render(<TodoItem todo={{ ...mockTodo, completed: true }} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)
    expect(getByRole('checkbox')).toBeChecked()
  })

  it('llama onToggle al hacer click en el checkbox', () => {
    const { getByRole } = render(<TodoItem todo={mockTodo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(1, true)
  })

  it('llama onEdit al hacer click en Editar', () => {
    const { getByText } = render(<TodoItem todo={mockTodo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(mockTodo)
  })

  it('llama onDelete al hacer click en Eliminar', () => {
    const { getByText } = render(<TodoItem todo={mockTodo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})