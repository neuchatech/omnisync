import { createProxy, meta } from './proxy';

describe('createProxy', () => {
    it('should return a proxy that behaves like the original object', () => {
        const original = { foo: 'bar' };
        const proxy = createProxy(original);

        expect(proxy.foo).toBe('bar');
        proxy.foo = 'baz';
        expect(proxy.foo).toBe('baz');
    });

    it('should notify listeners on change', () => {
        const original = { foo: 'bar' };
        const listener = jest.fn();
        const proxy = createProxy(original, listener);

        proxy.foo = 'baz';
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle nested objects with recursive proxying', () => {
        const original = { nested: { count: 0 } };
        const listener = jest.fn();
        const proxy = createProxy(original, listener);

        expect(proxy.nested.count).toBe(0);
        proxy.nested.count = 1;

        expect(proxy.nested.count).toBe(1);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should maintain stable identity for nested proxies', () => {
        const original = { nested: { count: 0 } };
        const proxy = createProxy(original);

        const nested1 = proxy.nested;
        const nested2 = proxy.nested;

        expect(nested1).toBe(nested2);
    });

    it('should expose META information', () => {
        const original = { foo: 'bar' };
        const proxy = createProxy(original);

        const metaState = meta(proxy);
        expect(metaState).toBeDefined();
        expect(metaState.status).toBe('ready');
    });

    it('should support Suspense by throwing a promise', () => {
        const original = { foo: 'bar' };
        const promise = new Promise(() => { });
        const suspense = (prop: string | symbol) => {
            if (prop === 'foo') return promise;
            return undefined;
        };
        const proxy = createProxy(original, undefined, suspense);

        try {
            // Accessing the property should throw
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            proxy.foo;
            // If we get here, it didn't throw
            throw new Error('Should have thrown a promise');
        } catch (e) {
            expect(e).toBe(promise);
        }
    });

    it('should notify on array mutation', () => {
        const spy = jest.fn();
        const proxy = createProxy<{ list: number[] }>({ list: [] }, spy);

        proxy.list.push(1);
        expect(spy).toHaveBeenCalled();
        expect(proxy.list).toHaveLength(1);
    });
});
