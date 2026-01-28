import React from 'react';
import './App.css';
import { useTimer } from './hooks/useTimer';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import Settings from './components/Settings';

function App() {
  const {
    timeLeft,
    isActive,
    mode,
    durations,
    updateDurations,
    toggleTimer,
    resetTimer,
    switchMode,
    getProgress,
    sessionsCompleted
  } = useTimer();

  return (
    <div className="app-container">
      <h1 className="title">pomodoro</h1>

      <Settings
        currentMode={mode}
        onSetMode={switchMode}
        durations={durations}
        onUpdateDurations={updateDurations}
      />

      <TimerDisplay
        timeLeft={timeLeft}
        mode={mode}
        progress={getProgress()}
      />

      <div style={{ margin: '1rem 0', fontSize: '1.2rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
        Sessions Completed: {sessionsCompleted}
      </div>

      <Controls
        isActive={isActive}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />
    </div>
  );
}

export default App;
