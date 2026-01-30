import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { LoginScreen } from './components/LoginScreen';
import { Board } from './components/Board';
import { ActiveQuestion } from './components/ActiveQuestion';
import { Scoreboard } from './components/Scoreboard';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();

  // Route 'auth' (Login/Register) and 'lobby' (Room Setup) to the LoginScreen component
  if (gameState.status === 'auth' || gameState.status === 'lobby') {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-jeopardy-yellow selection:text-jeopardy-blue">
      {gameState.status === 'playing' && (
        <>
          <Board />
          <Scoreboard />
        </>
      )}

      {gameState.status === 'question_active' && (
        <>
          <ActiveQuestion />
          <Scoreboard />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;