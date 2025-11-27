import React from 'react';
import { useOmni } from 'omnisync/react';
import { state, query } from '../store';

export const TagFilter: React.FC = () => {
    useOmni(state.tags);
    useOmni(state.filter);

    const toggleTag = (id: string) => {
        const selected = state.filter.selectedTags;
        if (selected.includes(id)) {
            state.filter.selectedTags = selected.filter(t => t !== id);
        } else {
            state.filter.selectedTags = [...selected, id];
        }
    };

    // Trigger fetch if empty
    if (state.tags.length === 0) {
        (query.tags as any).length;
    }

    return (
        <div style={{ padding: '0 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Filter by Tag:</span>
            {state.tags.map(tag => {
                const isSelected = state.filter.selectedTags.includes(tag.id);
                return (
                    <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        style={{
                            padding: '4px 12px',
                            borderRadius: '16px',
                            border: `2px solid ${tag.color}`,
                            backgroundColor: isSelected ? tag.color : 'transparent',
                            color: isSelected ? 'white' : tag.color,
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {tag.name}
                    </button>
                );
            })}
        </div>
    );
};
