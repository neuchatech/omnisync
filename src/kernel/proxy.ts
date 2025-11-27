import { Subscribable } from './subscribable';

export const META = Symbol('OmniSyncMeta');
export const ON_CHANGE = Symbol('OmniSyncOnChange');

export interface MetaState {
    status: 'idle' | 'loading' | 'error' | 'ready';
    error: Error | null;
    lastUpdated: number;
    isDirty: boolean;
}

export function meta(node: any): MetaState {
    return node[META];
}

export type ProxyTarget = Record<string | symbol, any>;

export function createProxy<T extends ProxyTarget>(
    target: T,
    onChange?: () => void,
    suspense?: (prop: string | symbol) => Promise<any> | undefined,
    cache = new WeakMap<object, any>()
): T {
    // Check cache first
    if (cache.has(target)) {
        return cache.get(target);
    }

    const subscribable = new Subscribable<void>();

    const handler: ProxyHandler<T> = {
        get(target, prop, receiver) {
            // Check for suspense first
            if (suspense) {
                const promise = suspense(prop);
                if (promise) {
                    throw promise;
                }
            }

            if (prop === META) {
                return {
                    status: 'ready',
                    error: null,
                    lastUpdated: Date.now(),
                    isDirty: false,
                } as MetaState;
            }

            if (prop === ON_CHANGE) {
                return subscribable;
            }

            const value = Reflect.get(target, prop, receiver);

            if (typeof value === 'object' && value !== null) {
                // Recursive proxying with cache
                return createProxy(value, () => {
                    subscribable.notify();
                    onChange?.();
                }, suspense, cache);
            }

            return value;
        },

        set(target, prop, value, receiver) {
            const result = Reflect.set(target, prop, value, receiver);
            if (result) {
                subscribable.notify();
                onChange?.();
            }
            return result;
        },
    };

    const proxy = new Proxy(target, handler);
    cache.set(target, proxy);
    return proxy;
}
