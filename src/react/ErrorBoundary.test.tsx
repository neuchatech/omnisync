import React from 'react';
import { render } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowError = () => {
    throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
    it('should render children when no error occurs', () => {
        const { getByText } = render(
            <ErrorBoundary>
                <div>Content</div>
            </ErrorBoundary>
        );
        expect(getByText('Content')).toBeTruthy();
    });

    it('should render fallback when an error occurs', () => {
        // Prevent console.error from cluttering the output
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const { getByText } = render(
            <ErrorBoundary fallback={<div>Fallback</div>}>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(getByText('Fallback')).toBeTruthy();

        consoleSpy.mockRestore();
    });

    it('should render default error message when no fallback provided', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const { getByText } = render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(getByText('Something went wrong: Test Error')).toBeTruthy();

        consoleSpy.mockRestore();
    });
});
