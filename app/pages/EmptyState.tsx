interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'No hay tareas para mostrar.' }: EmptyStateProps) {
  return (
    <p className="text-gray-400 text-center py-8">{message}</p>
  )
}
