import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { createProxy } from '../kernel/proxy';
import { useOmni } from './useOmni';

// Mock component to test the hook
const TestComponent = ({ proxy }: { proxy: any }) => {
    useOmni(proxy);
    return <div data-testid="value">{proxy.count}</div>;
};

describe('useOmni', () => {
    it('should re-render when proxy changes', async () => {
        const proxy = createProxy({ count: 0 });

        render(<TestComponent proxy={proxy} />);

        expect(screen.getByTestId('value').textContent).toBe('0');

        await act(async () => {
            proxy.count = 1;
        });

        expect(screen.getByTestId('value').textContent).toBe('1');
    });

    it('should handle nested proxy changes', async () => {
        const proxy = createProxy({ nested: { count: 0 } });

        const NestedComponent = ({ proxy }: { proxy: any }) => {
            useOmni(proxy);
            return <div data-testid="nested-value">{proxy.nested.count}</div>;
        };

        render(<NestedComponent proxy={proxy} />);

        expect(screen.getByTestId('nested-value').textContent).toBe('0');

        await act(async () => {
            proxy.nested.count = 1;
        });

        expect(screen.getByTestId('nested-value').textContent).toBe('1');
    });
});
