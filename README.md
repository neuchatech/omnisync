# OmniSync

OmniSync is a unified state management library that decouples **State Logic** (how components read/write data) from **State Storage** (where data lives).

## Installation

```bash
npm install omnisync
```

## Basic Usage

### 1. Define your State
Create a `store.ts` file to define your application state.

```typescript
import { defineState } from 'omnisync';

export const appState = defineState({
  todos: [
    { id: 1, title: 'Buy Milk', completed: false }
  ],
  ui: {
    theme: 'dark'
  }
});
```

### 2. Use in Components
Use the `useOmni` hook to read and write state.

```tsx
import React from 'react';
import { useOmni } from 'omnisync';
import { appState } from './store';

export function TodoList() {
  const state = useOmni(appState);

  return (
    <div>
      <h1>Todos ({state.ui.theme})</h1>
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => todo.completed = !todo.completed} 
            />
            {todo.title}
          </li>
        ))}
      </ul>
      <button onClick={() => state.todos.push({ id: Date.now(), title: 'New Item', completed: false })}>
        Add Todo
      </button>
    </div>
  );
}
```

## Advanced Usage

### Creating a Custom Backend Binding

To connect OmniSync to a custom backend (e.g., a specific API or database), implement the `BackendBinding` interface.

```typescript
import { BackendBinding, QueryRequest, QueryOptions } from 'omnisync';

export class MyCustomBinding implements BackendBinding {
  async read(query: QueryRequest) {
    // Fetch data from your API
    return fetch('/api/data').then(res => res.json());
  }

  async write(mutation: any) {
    // Send updates to your API
  }

  subscribe(query: QueryRequest, onUpdate: (data: any) => void) {
    // Setup realtime subscription
    return () => { /* unsubscribe */ };
  }

  buildQuery(collection: string, options: QueryOptions) {
    // Convert options to your API's query format
    return {};
  }
}
```

## Zero to Hero: SQLite Example

Here is a complete example of using OmniSync with a SQLite database.

```typescript
import { defineState, useOmni, bind, SQLiteBinding } from 'omnisync';
import React from 'react';

// 1. Setup Binding
const sqlite = new SQLiteBinding({ filename: 'app.db' });

// 2. Define State with Bindings
const store = defineState({
  // Local state
  ui: { theme: 'dark' },
  
  // Bound state (persisted to SQLite)
  todos: bind(sqlite, 'todos')
});

// 3. Use in Component
const TodoApp = () => {
  const state = useOmni(store);

  const addTodo = () => {
    // Optimistic update + DB write
    state.todos.add({ text: 'New Todo', completed: 0 });
  };

  return (
    <div>
      <h1>Todos ({state.todos.length})</h1>
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <button onClick={addTodo}>Add</button>
    </div>
  );
};
```

## Architecture

OmniSync uses a **Kernel + Adapter** architecture:

1.  **Kernel**: Pure TypeScript logic handling Proxies, Reactivity, and Bindings.
2.  **Adapters**: Framework-specific hooks (e.g., `useOmni` for React).
3.  **Bindings**: Connectors for data sources (SQLite, GraphQL, REST).

This separation ensures that your business logic remains independent of the UI framework and the data storage layer.
For more details, check the [Wiki](wiki/omnisync-technical-design.md).
