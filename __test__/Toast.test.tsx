import { Toast } from '@/app/components/Toast'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
describe('Toast', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    jest.useRealTimers()
    cleanup()
  })

  it('muestra el mensaje correctamente', () => {
    render(<Toast message="Tarea creada" type="success" onClose={jest.fn()} />)
    expect(screen.getByText('Tarea creada')).toBeInTheDocument()
  })

  it('llama onClose al hacer click en el botón ✕', () => {
    const onClose = jest.fn()
    render(<Toast message="Tarea creada" type="success" onClose={onClose} />)
    fireEvent.click(screen.getByText('✕'))
    act(() => jest.advanceTimersByTime(300))
    expect(onClose).toHaveBeenCalled()
  })

  it('llama onClose automáticamente después de 3s', () => {
    const onClose = jest.fn()
    render(<Toast message="Hola" type="error" onClose={onClose} />)
    act(() => jest.advanceTimersByTime(3300))
    expect(onClose).toHaveBeenCalled()
  })
})