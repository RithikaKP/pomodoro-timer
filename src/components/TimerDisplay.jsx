import React from 'react';
import { MODES } from '../hooks/useTimer';

const TimerDisplay = ({ timeLeft, mode, progress }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getThemeColor = () => {
        switch (mode) {
            case MODES.WORK: return 'var(--color-accent-primary)';
            case MODES.SHORT_BREAK: return 'var(--color-accent-secondary)';
            case MODES.LONG_BREAK: return 'var(--color-accent-tertiary)';
            default: return 'var(--color-text-primary)';
        }
    };

    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="timer-display flat-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                >
                    <circle
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke={getThemeColor()}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s linear, stroke 0.5s ease' }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '4rem',
                    fontWeight: '700',
                    fontVariantNumeric: 'tabular-nums'
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {mode === MODES.WORK ? 'Focus' : mode === MODES.SHORT_BREAK ? 'Short Break' : 'Long Break'}
            </div>
        </div>
    );
};

export default TimerDisplay;
