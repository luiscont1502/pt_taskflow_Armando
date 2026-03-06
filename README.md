# TaskFlow

Aplicación de gestión de tareas construida con Next.js, React, TypeScript y TailwindCSS. Consume la API pública de [DummyJSON](https://dummyjson.com/docs/todos).

## 🚀 Deploy

[URL de Vercel aquí]

## Instalación y ejecución local

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:3000`.

### Variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Contenido del `.env.local`:

```
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

## Funcionalidades

- **Listado paginado** de tareas (10 por página) con controles anterior/siguiente
- **Crear tarea** vía formulario con feedback de éxito o error
- **Editar tarea** con modal custom y actualización optimista
- **Marcar como completada/pendiente** con optimistic update
- **Eliminar tarea** con modal de confirmación custom
- **Filtro local** por Todas / Pendientes / Completadas
- **Búsqueda en tiempo real** sin llamadas extra a la API
- **Drag & drop** para reordenar tareas
- **Animaciones** de entrada/salida con Framer Motion
- **Toast notifications** custom con Tailwind
- **Loading skeleton** mientras cargan los datos
- **Persistencia local** con IndexedDB

## Estructura del proyecto

```
app/
├── common/
│   └── HttpClientCommon.ts     # Cliente HTTP reutilizable (clase con métodos get/post/patch/delete)
├── components/
│   ├── TodoItem.tsx            # Componente de cada tarea (con drag handle)
│   ├── TodoSkeleton.tsx        # Skeleton de loading
│   ├── Emptystate.tsx          # Estado vacío
│   ├── Toast.tsx               # Notificación toast animada
│   ├── Confirmdialog.tsx       # Modal de confirmación para eliminar
│   ├── Editdialog.tsx          # Modal de edición
│   └── Usetoast.tsx            # Hook del toast
├── hooks/
│   └── useTodos.ts             # Lógica de fetching, estado, filtros 
├── pages/
│   ├── TodoItem.tsx
│   ├── EmptyState.tsx
│   └── TodoSkeleton.tsx
├── services/
│   ├── api.service.ts          # Llamadas a DummyJSON (usa HttpClientCommon)
│   └── indexedDB.service.ts    # Persistencia local
├── types/
│   └── todos.ts                # Tipos TypeScript de la API
└── page.tsx                    # Página principal
__tests__/
├── api.service.test.ts
├── useTodos.test.ts
├── TodoItem.test.tsx
└── Toast.test.tsx
```

## Decisiones técnicas

### HttpClient reutilizable

Se creó una clase `HttpClient` en `common/HttpClientCommon.ts` con métodos `get`, `post`, `patch` y `delete`. Centraliza los headers y la serialización del body, evitando repetición y facilitando cambios globales (ej. agregar un token de autenticación en el futuro).

### Estado: useState (React built-in)

Se eligió `useState` nativo en lugar de Zustand u otra librería externa porque la aplicación maneja un único recurso (`todos`) con operaciones simples. Agregar Zustand hubiera sido overengineering para el alcance de esta prueba.

### Optimistic Update

Se implementó optimistic update en `toggleTodo` y `editTodo`: la UI se actualiza de inmediato sin esperar la respuesta de la API. Si la API falla por un error real de red, se hace rollback. Si falla porque el ID no existe en DummyJSON (tareas locales con ID > 150), se mantiene el cambio ya que es el comportamiento esperado.

### IDs únicos para tareas locales

DummyJSON siempre devuelve `id: 255` para cualquier tarea creada. Para evitar duplicados en el estado local, se reemplaza el ID con `Date.now()`, garantizando unicidad.

### IndexedDB

Se usa IndexedDB para persistir las operaciones de escritura localmente, ya que DummyJSON no persiste los cambios en el servidor.

### Drag & Drop

Se implementó con `@dnd-kit` por ser la librería más moderna y accesible para drag & drop en React. El reordenamiento es solo local.

### Animaciones

Se usó Framer Motion para animaciones de entrada/salida de tareas (`AnimatePresence`) y animación del header, sin forzarlo donde no agrega valor.

### Lógica en custom hooks

Toda la lógica de fetching, estado y efectos secundarios vive en `useTodos.ts`. Los componentes de UI solo reciben props y llaman callbacks.

### Sin `any`

No se usa `any` en el código. Todos los tipos están definidos en `types/todos.ts`.

## Testing

Tests con Jest + React Testing Library. **25 tests en total.**

```bash
npm test
# o
pnpm test
```

Cobertura:
- `api.service.test.ts` — getTodos, createTodo, updateTodo, deleteTodo
- `useTodos.test.ts` — carga, filtros, búsqueda, CRUD, manejo de errores
- `TodoItem.test.tsx` — render, checkbox, toggle, editar, eliminar
- `Toast.test.tsx` — render, auto-close, close on click

## Scripts disponibles

```bash
pnpm dev       # Servidor de desarrollo
pnpm build     # Compilar para producción
pnpm start     # Servidor de producción
pnpm lint      # ESLint
pnpm test      # Jest
```

## Stack

- [Next.js 15](https://nextjs.org)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [@dnd-kit](https://dndkit.com)
- [Jest](https://jestjs.io) + [React Testing Library](https://testing-library.com)
- [DummyJSON API](https://dummyjson.com/docs/todos)