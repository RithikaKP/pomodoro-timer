import { useState, useEffect, useRef, useCallback } from 'react';

export const MODES = {
    WORK: 'work',
    SHORT_BREAK: 'shortBreak',
    LONG_BREAK: 'longBreak',
};

const DEFAULT_DURATIONS = {
    [MODES.WORK]: 25,
    [MODES.SHORT_BREAK]: 5,
    [MODES.LONG_BREAK]: 15,
};

export function useTimer() {
    const [mode, setMode] = useState(MODES.WORK);
    const [durations, setDurations] = useState(DEFAULT_DURATIONS);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS[MODES.WORK] * 60);
    const [isActive, setIsActive] = useState(false);

    // Sound refs
    const audioContextRef = useRef(null);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    // Play sound helper
    const playSound = useCallback((type) => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'start') {
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
            } else if (type === 'end') {
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);
                osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.6);
                gain.gain.setValueAtTime(0.5, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.6);
            }
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, []);

    // Timer Custom Logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    // Completion Check
    useEffect(() => {
        if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playSound('end');
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification("Pomodoro Timer", {
                    body: `${mode === MODES.WORK ? 'Focus' : 'Break'} session finished!`,
                });
            }

            if (mode === MODES.WORK) {
                setSessionsCompleted((prev) => prev + 1);
                switchMode(MODES.SHORT_BREAK);
            } else {
                switchMode(MODES.WORK);
            }
        }
    }, [timeLeft, isActive, mode, playSound, durations]); // Added durations to dependency if needed by switchMode logic inside (though switchMode depends on state)

    const toggleTimer = () => {
        if (!isActive) {
            playSound('start');
        }
        setIsActive(!isActive);
    };

    const updateDurations = (newDurations) => {
        setDurations(newDurations);
        // If we are currently in a mode that was updated, we might want to reset the timer
        // But standard behavior is usually to wait for reset.
        // However, if the timer is NOT active, let's update immediately for better UX
        if (!isActive) {
            setTimeLeft(newDurations[mode] * 60);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(durations[mode] * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(durations[newMode] * 60);
    };

    const getProgress = () => {
        const totalTime = durations[mode] * 60;
        return ((totalTime - timeLeft) / totalTime) * 100;
    };

    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    return {
        timeLeft,
        isActive,
        mode,
        durations,
        updateDurations,
        toggleTimer,
        resetTimer,
        switchMode,
        getProgress,
        MODES,
        sessionsCompleted,
    };
}
