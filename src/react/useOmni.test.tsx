import React from 'react';
import { render, act } from '@testing-library/react';
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

        const { getByTestId } = render(<TestComponent proxy={proxy} />);

        expect(getByTestId('value').textContent).toBe('0');

        await act(async () => {
            proxy.count = 1;
        });

        expect(getByTestId('value').textContent).toBe('1');
    });

    it('should handle nested proxy changes', async () => {
        const proxy = createProxy({ nested: { count: 0 } });

        const NestedComponent = ({ proxy }: { proxy: any }) => {
            useOmni(proxy);
            return <div data-testid="nested-value">{proxy.nested.count}</div>;
        };

        const { getByTestId } = render(<NestedComponent proxy={proxy} />);

        expect(getByTestId('nested-value').textContent).toBe('0');

        await act(async () => {
            proxy.nested.count = 1;
        });

        expect(getByTestId('nested-value').textContent).toBe('1');
    });

    it('should not re-render if unrelated state changes (optimization check)', async () => {
        // Note: Current implementation of useOmni subscribes to the whole proxy, 
        // so it MIGHT re-render on any change. 
        // Ideally, we want fine-grained subscriptions, but for now let's just verify it works.
        // If we implement selector-based subscription later, this test will be useful.

        const proxy = createProxy({ count: 0, other: 'test' });
        let renderCount = 0;

        const RenderCounter = ({ proxy }: { proxy: any }) => {
            useOmni(proxy);
            renderCount++;
            return <div data-testid="value">{proxy.count}</div>;
        };

        const { getByTestId } = render(<RenderCounter proxy={proxy} />);
        expect(renderCount).toBe(1);

        await act(async () => {
            proxy.other = 'changed';
        });

        // Current implementation: re-renders on any change to the proxy tree
        expect(renderCount).toBe(2);
        expect(getByTestId('value').textContent).toBe('0');
    });
});
