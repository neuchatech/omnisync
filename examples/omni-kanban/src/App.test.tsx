import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock the MockDB delay to speed up tests
vi.mock('./mock-db', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        db: {
            ...actual.db,
            query: async (collection: string, options: any) => {
                console.log('MockDB Query:', collection, options);
                // Return immediate results
                if (collection === 'tasks') {
                    const tasks = [
                        { id: '1', title: 'Test Task 1', status: 'todo', order: 0, tags: [] },
                        { id: '2', title: 'Test Task 2', status: 'doing', order: 0, tags: [] }
                    ];
                    // Simple filter
                    if (options.where && options.where.status) {
                        return tasks.filter(t => t.status === options.where.status);
                    }
                    return tasks;
                }
                if (collection === 'tags') {
                    return [{ id: 't1', name: 'Test Tag', color: 'red' }];
                }
                return [];
            }
        }
    };
});

describe('OmniKanban App', () => {
    it('renders the board and loads tasks', async () => {
        render(<App />);

        // Wait for the loading state first
        expect(await screen.findByText('Test Task 1')).toBeDefined();
        expect(await screen.findByText('Test Task 2')).toBeDefined();

        // Check updated counts
        expect(await screen.findByText('To Do (1)')).toBeDefined();
        expect(await screen.findByText('In Progress (1)')).toBeDefined();
    });
});
