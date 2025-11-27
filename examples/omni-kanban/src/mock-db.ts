import { Task, Tag } from './types';

const DELAY_MS = 500;

const initialTags: Tag[] = [
    { id: 't1', name: 'Bug', color: 'red' },
    { id: 't2', name: 'Feature', color: 'blue' },
    { id: 't3', name: 'Design', color: 'green' },
];

const initialTasks: Task[] = [
    { id: '1', title: 'Setup Repo', status: 'done', order: 0, tags: [initialTags[1]] },
    { id: '2', title: 'Implement Kernel', status: 'done', order: 1, tags: [initialTags[1]] },
    { id: '3', title: 'Build UI', status: 'doing', order: 0, tags: [initialTags[2]] },
    { id: '4', title: 'Fix Bugs', status: 'todo', order: 0, tags: [initialTags[0]] },
    { id: '5', title: 'Write Tests', status: 'todo', order: 1, tags: [initialTags[0], initialTags[1]] },
];

export class MockDB {
    private tasks = [...initialTasks];
    private tags = [...initialTags];

    async query(collection: string, options: any): Promise<any[]> {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));

        let data: any[] = collection === 'tasks' ? this.tasks : this.tags;

        // 1. Filter
        if (options.where) {
            data = data.filter(item => {
                for (const [key, val] of Object.entries(options.where)) {
                    if ((item as any)[key] !== val) return false;
                }
                return true;
            });
        }

        // 2. Sort
        if (options.orderBy) {
            data = [...data].sort((a, b) => {
                for (const [key, dir] of Object.entries(options.orderBy)) {
                    if ((a as any)[key] < (b as any)[key]) return dir === 'asc' ? -1 : 1;
                    if ((a as any)[key] > (b as any)[key]) return dir === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        // 3. Pagination
        if (options.offset !== undefined || options.limit !== undefined) {
            const start = options.offset || 0;
            const end = options.limit ? start + options.limit : undefined;
            data = data.slice(start, end);
        }

        // 4. Relations (Include)
        // In a real DB this is a join. Here we just ensure the data has the field.
        // Our mock data already has nested objects for simplicity, but we could simulate fetching.

        return JSON.parse(JSON.stringify(data)); // Return copy
    }

    async update(collection: string, mutation: any): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        console.log('MockDB Update:', collection, mutation);
        // Implementation for mutations would go here (update this.tasks)
        // For this demo, we might rely on optimistic updates mostly, 
        // or implement a simple ID-based update.
        if (collection === 'tasks' && mutation.id && mutation.data) {
            const idx = this.tasks.findIndex(t => t.id === mutation.id);
            if (idx !== -1) {
                this.tasks[idx] = { ...this.tasks[idx], ...mutation.data };
            }
        }
    }
}

export const db = new MockDB();
