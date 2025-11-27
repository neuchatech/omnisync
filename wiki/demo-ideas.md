# OmniSync Demo App Concepts

Here are 3 proposals for a Proof-of-Concept app to verify OmniSync's capabilities.

## 1. Team Task Manager (The Classic)
A shared todo list with user assignments.
*   **Core Features**:
    *   List active tasks: `state.todos.where({ done: false })`
    *   Assignee details: `.include('assignee')`
    *   Optimistic toggle: Check/uncheck tasks.
    *   Filtering: "My Tasks" vs "All Tasks".
*   **Why**: It's the standard for a reason. It cleanly tests relations (Todo -> User) and basic filtering.

## 2. Live Kanban Board
A board with columns (Todo, In Progress, Done) and drag-and-drop.
*   **Core Features**:
    *   Multiple active queries: One for each column (`status: 'todo'`, `status: 'doing'`, etc.).
    *   Drag & Drop: Moving a card updates its `status` field.
    *   Optimistic UI: The card moves instantly, even if the backend is slow.
*   **Why**: Demonstrates **multiple concurrent subscriptions** and how the cache handles moving an item from one query's result set to another (the "Predicate Matching" feature).

## 3. Social Feed (Infinite Scroll)
A Twitter-like feed of short posts.
*   **Core Features**:
    *   Pagination: `state.posts.orderBy({ date: 'desc' }).limit(10).offset(n)`
    *   Author details: `.include('author')`
    *   "Like" button: Optimistic mutation on a counter.
    *   "Load More": Updates the offset/limit.
*   **Why**: Best for testing **pagination strategies** (`limit`/`offset`) and list appending.

## Recommendation
I recommend **Option 2 (Live Kanban Board)**. It is slightly more complex than the Todo list but does a much better job of demonstrating the "Reactive Query" capabilities (items moving between lists automatically) which is OmniSync's killer feature.
