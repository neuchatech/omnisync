import { defineState } from '../../src/kernel/defineState';

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export const todoStore = defineState({
    todos: [] as Todo[],
    filter: 'all' as 'all' | 'active' | 'completed'
});
