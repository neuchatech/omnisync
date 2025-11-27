import React from 'react';
import { Task } from '../types';

interface CardProps {
    task: Task;
    onDragStart: (e: React.DragEvent, id: string) => void;
}

export const Card: React.FC<CardProps> = ({ task, onDragStart }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className="card"
            style={{
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'grab'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{task.title}</div>
            <div style={{ display: 'flex', gap: '4px' }}>
                {task.tags.map(tag => (
                    <span
                        key={tag.id}
                        style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            backgroundColor: tag.color,
                            color: 'white'
                        }}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
        </div>
    );
};
