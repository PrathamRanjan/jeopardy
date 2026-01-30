import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export const ActiveQuestion: React.FC = () => {
  const { gameState, closeQuestion, awardPoints } = useGame();
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Find the active question object
  const activeCat = gameState.categories.find(c => c.questions.some(q => q.id === gameState.currentQuestionId));
  const question = activeCat?.questions.find(q => q.id === gameState.currentQuestionId);

  if (!question) return <div>Error: Question not found</div>;

  return (
    <div className="min-h-screen bg-jeopardy-blue flex flex-col p-4 pb-32">
       {/* Top Bar Info */}
       <div className="flex justify-between text-white/60 font-bold uppercase tracking-widest mb-8">
           <span>{activeCat?.title}</span>
           <span>${question.points}</span>
       </div>

       {/* Question Text */}
       <div className="flex-grow flex items-center justify-center text-center px-8 relative">
           {!showAnswer ? (
             <h2 className="text-3xl md:text-6xl font-bold text-white uppercase leading-tight drop-shadow-lg max-w-5xl jeopardy-text">
                 {question.question}
             </h2>
           ) : (
             <div className="animate-fade-in">
               <div className="text-jeopardy-yellow text-xl mb-4 font-mono">ANSWER</div>
               <h2 className="text-3xl md:text-6xl font-bold text-white uppercase leading-tight drop-shadow-lg max-w-5xl jeopardy-text">
                   {question.answer}
               </h2>
             </div>
           )}
       </div>

       {/* Controls Area */}
       <div className="h-1/3 flex flex-col items-center justify-end gap-6 pb-8">
           
           {!showAnswer ? (
               <button 
                 onClick={() => setShowAnswer(true)}
                 className="bg-yellow-500 text-black font-black text-xl px-8 py-3 rounded-full hover:scale-105 transition shadow-lg"
               >
                 SHOW ANSWER
               </button>
           ) : (
               <div className="bg-jeopardy-dark p-6 rounded-xl border border-blue-500 flex flex-col items-center gap-4 w-full max-w-2xl">
                   <h3 className="text-white font-bold mb-2">Who got it right?</h3>
                   <div className="flex flex-wrap gap-2 justify-center">
                       {gameState.players.map(p => (
                           <div key={p.id} className="flex flex-col gap-1">
                               <button 
                                  onClick={() => awardPoints(p.id, question.points)}
                                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold text-sm"
                               >
                                  {p.name} (+${question.points})
                               </button>
                               <button 
                                  onClick={() => awardPoints(p.id, -question.points)}
                                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold text-xs opacity-50 hover:opacity-100"
                               >
                                  Wrong (-${question.points})
                               </button>
                           </div>
                       ))}
                   </div>
                   <div className="w-full h-px bg-blue-800 my-2" />
                   <button 
                       onClick={closeQuestion}
                       className="text-gray-400 hover:text-white underline text-sm"
                   >
                       No one got it (Back to Board)
                   </button>
               </div>
           )}

       </div>
    </div>
  );
};
