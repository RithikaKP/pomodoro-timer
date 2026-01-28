import React from 'react';

const Controls = ({ isActive, onToggle, onReset }) => {
    return (
        <div className="controls" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
                onClick={onToggle}
                style={{
                    fontSize: '1.2rem',
                    padding: '1rem 3rem',
                    backgroundColor: isActive ? 'var(--color-bg-hover)' : 'var(--color-text-primary)',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-bg-dark)',
                    boxShadow: isActive ? 'none' : 'var(--shadow-lg)'
                }}
            >
                {isActive ? 'PAUSE' : 'START'}
            </button>
            <button
                onClick={onReset}
                style={{ fontSize: '1.5rem', padding: '1rem' }}
                aria-label="Reset Timer"
            >
                &#x21bb; {/* Refresh/Reset unicode symbol */}
            </button>
        </div>
    );
};

export default Controls;
