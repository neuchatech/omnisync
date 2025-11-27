import React from 'react';
import { useOmni } from 'omnisync/react';
import { state, query, actions } from '../store';
import { Task } from '../types';
import { Card } from './Card';

interface ColumnProps {
    status: Task['status'];
    title: string;
}

export const Column: React.FC<ColumnProps> = ({ status, title }) => {
    // 1. Subscribe to state
    useOmni(state.tasks);
    useOmni(state.filter);

    // 2. Filter tasks
    const tasks = state.tasks
        .filter(t => t.status === status)
        .filter(t => {
            if (state.filter.selectedTags.length === 0) return true;
            return t.tags.some(tag => state.filter.selectedTags.includes(tag.id));
        })
        .sort((a, b) => a.order - b.order);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            actions.moveTask(taskId, status);
        }
    };

    const loadMore = () => {
        const currentCount = state.tasks.filter(t => t.status === status).length;
        (query.tasks.where({ status }).offset(currentCount).limit(5) as any).length;
    };

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
                flex: 1,
                backgroundColor: '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <h2 style={{ fontSize: '1.2em', marginBottom: '16px', textTransform: 'capitalize' }}>
                {title} ({tasks.length})
            </h2>

            <div style={{ flex: 1 }}>
                {tasks.map(task => (
                    <Card
                        key={task.id}
                        task={task}
                        onDragStart={(e, id) => e.dataTransfer.setData('taskId', id)}
                    />
                ))}
            </div>

            <button
                onClick={loadMore}
                style={{
                    marginTop: '10px',
                    padding: '8px',
                    width: '100%',
                    backgroundColor: '#e5e7eb',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Load More
            </button>
        </div>
    );
};

export const ColumnLoader: React.FC<{ status: Task['status'] }> = ({ status }) => {
    (query.tasks.where({ status }) as any).length;
    return null;
};
