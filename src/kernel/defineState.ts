import { createProxy } from '../kernel/proxy';

export function defineState<T extends object>(initialState: T): T {
    // In the future, this is where we would attach bindings based on the schema
    // For now, it just creates the root proxy
    return createProxy(initialState);
}
