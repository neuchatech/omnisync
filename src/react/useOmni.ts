import { useEffect, useReducer } from 'react';
import { ON_CHANGE } from '../kernel/proxy';
import { Subscribable } from '../kernel/subscribable';

export function useOmni<T>(proxy: T): T {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        if (!proxy) return;

        const subscribable = (proxy as any)[ON_CHANGE] as Subscribable<void>;
        if (subscribable) {
            const unsubscribe = subscribable.subscribe(() => {
                forceUpdate();
            });
            return unsubscribe;
        }
    }, [proxy]);

    return proxy;
}
