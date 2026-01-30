import React from 'react';
import { useGame } from '../context/GameContext';
import clsx from 'clsx';

export const Scoreboard: React.FC = () => {
  const { gameState } = useGame();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-jeopardy-dark border-t-4 border-black p-4 flex justify-center gap-8 items-center z-50 overflow-x-auto">
      {gameState.players.map((player) => (
        <div 
          key={player.id} 
          className={clsx(
            "flex flex-col items-center min-w-[100px] p-2 rounded transition-all",
            gameState.buzzedPlayerId === player.id ? "animate-pulse ring-4 ring-red-500 bg-red-900/50" : ""
          )}
        >
          <div className="text-jeopardy-yellow font-bold text-xl font-mono text-shadow-md">
            ${player.score}
          </div>
          <div className="text-white font-semibold uppercase tracking-wider text-sm flex items-center gap-1">
            {player.name}
          </div>
        </div>
      ))}
    </div>
  );
};
