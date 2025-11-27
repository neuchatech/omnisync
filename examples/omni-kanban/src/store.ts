import { createProxy, CollectionProxy, BackendBinding, QueryRequest, MutationRequest, UnsubscribeFn, QueryOptions } from 'omnisync';
import { db } from './mock-db';
import { Task, Tag } from './types';

// 1. Define the State Shape
export interface AppState {
    tasks: Task[];
    tags: Tag[];
    filter: {
        selectedTags: string[]; // Tag IDs
    };
}

// 2. Create the Mock Binding
class MockBinding implements BackendBinding {
    async read(query: QueryRequest): Promise<any> {
        return db.query(query.variables?.collection, query.variables?.options);
    }

    async write(mutation: MutationRequest): Promise<void> {
        return db.update(mutation.variables?.collection, mutation.variables);
    }

    subscribe(query: QueryRequest, onUpdate: (data: any) => void): UnsubscribeFn {
        return () => { };
    }

    buildQuery(collection: string, options: QueryOptions): QueryRequest {
        return {
            variables: { collection, options }
        };
    }
}

const binding = new MockBinding();

// 3. Create the Store (Proxy)
export const state = createProxy<AppState>({
    tasks: [],
    tags: [],
    filter: {
        selectedTags: []
    }
});

// 4. Create the Query Builder Resolver with Caching
const requestCache = new Map<string, Promise<any> | any[]>();

const resolver = (collection: string) => (options: QueryOptions) => {
    const key = `${collection}:${JSON.stringify(options)}`;

    if (requestCache.has(key)) {
        const cached = requestCache.get(key);
        if (cached instanceof Promise) return cached;
        return cached; // Return the cached data (array)
    }

    const query = binding.buildQuery(collection, options);
    const promise = binding.read(query).then(data => {
        // Merge into state
        if (collection === 'tasks') {
            const tasks = state.tasks;
            (data as Task[]).forEach(item => {
                const idx = tasks.findIndex(t => t.id === item.id);
                if (idx >= 0) {
                    Object.assign(tasks[idx], item);
                } else {
                    tasks.push(item);
                }
            });
        } else if (collection === 'tags') {
            state.tags = data;
        }

        // Update cache with result
        requestCache.set(key, data);
        return data;
    });

    requestCache.set(key, promise);
    return promise;
};

// 5. Expose Query Builders
export const query = {
    tasks: new CollectionProxy<Task>('tasks', {}, resolver('tasks')),
    tags: new CollectionProxy<Tag>('tags', {}, resolver('tags')),
};

// 6. Actions
export const actions = {
    moveTask: (taskId: string, newStatus: Task['status']) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus; // Optimistic update
            // In real app: binding.write(...)
        }
    }
};
