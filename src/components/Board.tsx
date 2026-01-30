import React from 'react';
import { useGame } from '../context/GameContext';
import clsx from 'clsx';

export const Board: React.FC = () => {
  const { gameState, openQuestion } = useGame();

  const columnCount = gameState.categories.length;

  return (
    <div className="min-h-screen bg-jeopardy-blue flex flex-col items-center justify-center p-4 pb-32">
      <div 
        className="w-full max-w-[95vw] grid gap-2 bg-black border-4 border-black shadow-2xl overflow-x-auto"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(150px, 1fr))` }}
      >
        {/* Headers */}
        {gameState.categories.map((cat) => (
          <div key={cat.id} className="bg-jeopardy-blue flex items-center justify-center p-4 text-center border-b-2 border-black min-h-[80px]">
            <h3 className="text-white font-bold text-sm md:text-lg lg:text-xl uppercase text-shadow leading-tight line-clamp-2">{cat.title}</h3>
          </div>
        ))}

        {/* Questions Grid */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {gameState.categories.map((cat) => {
              const sortedQs = [...(cat.questions || [])].sort((a,b) => a.points - b.points);
              const question = sortedQs[rowIndex];

              if (!question) return <div key={`${cat.id}-${rowIndex}`} className="bg-jeopardy-blue min-h-[100px]" />;

              return (
                <button
                  key={question.id}
                  disabled={question.isAnswered}
                  onClick={() => !question.isAnswered && openQuestion(question.id)}
                  className={clsx(
                    "flex items-center justify-center p-4 transition duration-300 min-h-[100px]",
                    question.isAnswered 
                      ? "bg-jeopardy-blue" 
                      : "bg-jeopardy-blue cursor-pointer hover:bg-blue-700 hover:brightness-110"
                  )}
                >
                  {!question.isAnswered && (
                    <span className="text-jeopardy-yellow font-black text-2xl md:text-4xl lg:text-5xl text-shadow-md font-mono">
                      ${question.points}
                    </span>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};