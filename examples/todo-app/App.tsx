import React from 'react';
import { useOmni } from '../../src/react/useOmni';
import { todoStore } from './store';

export const TodoApp = () => {
    const state = useOmni(todoStore);

    const addTodo = () => {
        state.todos.push({
            id: Date.now(),
            text: 'New Todo',
            completed: false
        });
    };

    const toggleTodo = (id: number) => {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    };

    return (
        <div>
            <button onClick={addTodo}>Add Todo</button>
            <ul>
                {state.todos.map(todo => (
                    <li key={todo.id} onClick={() => toggleTodo(todo.id)} data-testid={`todo-${todo.id}`}>
                        {todo.text} - {todo.completed ? 'Completed' : 'Active'}
                    </li>
                ))}
            </ul>
        </div>
    );
};
