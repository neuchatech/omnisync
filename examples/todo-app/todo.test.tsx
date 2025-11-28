import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { TodoApp } from './App';
import { todoStore } from './store';

describe('TodoApp Integration', () => {
    beforeEach(() => {
        // Reset store
        todoStore.todos = [];
        todoStore.filter = 'all';
    });

    it('should add and toggle todos', async () => {
        const { getByText, getAllByRole, findByText } = render(<TodoApp />);

        const addButton = getByText('Add Todo');

        // Add a todo
        await act(async () => {
            fireEvent.click(addButton);
        });

        const items = getAllByRole('listitem');
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveTextContent('New Todo - Active');

        // Toggle the todo
        await act(async () => {
            fireEvent.click(items[0]);
        });

        expect(items[0]).toHaveTextContent('New Todo - Completed');
    });
});
