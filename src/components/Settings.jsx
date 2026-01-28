import React, { useState } from 'react';
import { MODES } from '../hooks/useTimer';

const Settings = ({ currentMode, onSetMode, durations, onUpdateDurations }) => {
    const [showCustom, setShowCustom] = useState(false);

    const handleDurationChange = (mode, value) => {
        const newVal = parseInt(value, 10);
        if (!isNaN(newVal) && newVal > 0) {
            onUpdateDurations({
                ...durations,
                [mode]: newVal
            });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="settings flat-card" style={{
                padding: '0.5rem',
                display: 'inline-flex',
                borderRadius: '12px',
                gap: '0.25rem',
                backgroundColor: 'var(--color-bg-card)'
            }}>
                {Object.values(MODES).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => onSetMode(mode)}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: currentMode === mode ? 'var(--color-bg-hover)' : 'transparent',
                            color: currentMode === mode ? '#fff' : 'var(--color-text-secondary)',
                            fontWeight: currentMode === mode ? '600' : '500',
                            border: 'none',
                            fontSize: '0.9rem',
                            padding: '0.5rem 1.5rem',
                            boxShadow: 'none',
                        }}
                    >
                        {mode === MODES.WORK ? 'Focus' : mode === MODES.SHORT_BREAK ? 'Short' : 'Long'}
                    </button>
                ))}
            </div>

            <button
                onClick={() => setShowCustom(!showCustom)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', background: 'transparent', boxShadow: 'none', color: 'var(--color-text-secondary)' }}
            >
                {showCustom ? 'Hide Settings' : 'Customize Timers'}
            </button>

            {showCustom && (
                <div className="flat-card" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {Object.values(MODES).map((mode) => (
                        <div key={mode} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                {mode === MODES.WORK ? 'Focus' : mode === MODES.SHORT_BREAK ? 'Short' : 'Long'}
                            </label>
                            <input
                                type="number"
                                value={durations[mode]}
                                onChange={(e) => handleDurationChange(mode, e.target.value)}
                                style={{
                                    background: 'var(--color-bg-dark)',
                                    border: '1px solid var(--color-bg-hover)',
                                    color: '#fff',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    width: '60px',
                                    textAlign: 'center'
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Settings;
