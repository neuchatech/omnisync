import React, { Suspense } from 'react';
import { Column, ColumnLoader } from './components/Column';
import { TagFilter } from './components/TagFilter';
import { ErrorBoundary as OmniErrorBoundary } from 'omnisync/react';

// Cast ErrorBoundary to any to bypass React version mismatch for verification
const ErrorBoundary = OmniErrorBoundary as any;

function App() {
    return (
        <div className="app">
            <h1>OmniKanban</h1>
            <TagFilter />
            <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                <ErrorBoundary fallback={<div>Error loading tasks</div>}>
                    <Suspense fallback={<div>Loading Board...</div>}>
                        {/* Trigger fetches */}
                        <ColumnLoader status="todo" />
                        <ColumnLoader status="doing" />
                        <ColumnLoader status="done" />

                        {/* Render UI */}
                        <Column title="To Do" status="todo" />
                        <Column title="In Progress" status="doing" />
                        <Column title="Done" status="done" />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default App;
