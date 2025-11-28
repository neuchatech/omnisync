import { useState, useEffect, useReducer } from 'react';
import { subscribe } from '../kernel/proxy';

export function useOmni<T>(state: T): T {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        // Subscribe to the proxy
        // Note: The current subscribe implementation in proxy.ts is a placeholder
        // We need to ensure it actually works.
        // For now, assuming subscribe(state, callback) works.
        const unsubscribe = subscribe(state, () => {
            forceUpdate();
        });

        return () => {
            unsubscribe();
        };
    }, [state]);

    return state;
}
