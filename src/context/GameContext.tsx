import React, { createContext, useContext, useState } from 'react';
import type { GameState, Player, Category, Question, Group } from '../types';
import { PRESET_CATEGORIES } from '../data/initialData';
import * as FB from '../services/FirebaseService';

interface GameContextType {
  gameState: GameState;
  register: (u: string, p: string) => Promise<boolean>;
  login: (u: string, p: string) => Promise<boolean>;
  createGroup: (name: string, pass: string) => Promise<boolean>;
  joinGroup: (name: string, pass: string) => Promise<boolean>;
  
  createCategory: (title: string) => Promise<void>;
  addQuestion: (catId: string, q: string, a: string, pts: number) => Promise<void>;
  
  startGame: (selectedCategoryIds: string[]) => void;
  addPlayer: (name: string) => void;
  openQuestion: (questionId: string) => void;
  closeQuestion: () => void;
  awardPoints: (playerId: string, points: number) => void;
  logout: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'auth',
    currentUser: null,
    activeGroup: null,
    categories: [],
    players: [],
    currentQuestionId: null,
    buzzedPlayerId: null,
  });

  // --- AUTH ---
  const register = async (u: string, p: string) => {
      return await FB.registerUser(u, p);
  };

  const login = async (u: string, p: string) => {
      const user = await FB.loginUser(u, p);
      if (user) {
          setGameState(prev => ({ ...prev, currentUser: user, status: 'lobby' }));
          return true;
      }
      return false;
  };

  const logout = () => {
      setGameState(prev => ({ ...prev, currentUser: null, status: 'auth', activeGroup: null }));
  };

  // --- ROOMS ---
  const createGroup = async (name: string, pass: string) => {
      if (!gameState.currentUser) return false;
      const group = await FB.createRoom(name, pass, gameState.currentUser.username);
      if (group) {
          setGameState(prev => ({ ...prev, activeGroup: group }));
          return true;
      }
      return false;
  };

  const joinGroup = async (name: string, pass: string) => {
      const group = await FB.joinRoom(name, pass);
      if (group) {
          const cats = await FB.getCategories(group.id);
          setGameState(prev => ({ ...prev, activeGroup: { ...group, categories: cats } }));
          return true;
      }
      return false;
  };

  // --- CONTENT ---
  const createCategory = async (title: string) => {
      if (!gameState.activeGroup) return;
      const newCat = await FB.addCategoryToRoom(gameState.activeGroup.id, title);
      setGameState(prev => {
          if (!prev.activeGroup) return prev;
          const updatedGroup: Group = {
              ...prev.activeGroup,
              categories: [...prev.activeGroup.categories, newCat!] // newCat checked in service but simple assertion here for flow
          };
          // Filter null if service returned null
          if (!newCat) return prev;

          return {
              ...prev,
              activeGroup: updatedGroup
          };
      });
  };

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addQuestion = async (catId: string, q: string, a: string, pts: number) => {
      if (!gameState.activeGroup) return;
      const success = await FB.addQuestionToCategory(catId, { points: pts, question: q, answer: a });
      
      if (success) {
          const newQ: Question = { 
            id: generateId(), 
            points: pts, 
            question: q, 
            answer: a, 
            isAnswered: false 
          };

          setGameState(prev => {
             const group = prev.activeGroup;
             if (!group) return prev;
             
             const updatedCategories: Category[] = group.categories.map((c: Category): Category => {
                 if (c.id === catId) {
                     return {
                         ...c,
                         questions: [...(c.questions || []), newQ]
                     };
                 }
                 return c;
             });

             const updatedGroup: Group = {
                 ...group,
                 categories: updatedCategories
             };

             return { 
                 ...prev, 
                 activeGroup: updatedGroup
             } as any as GameState;
          });
      }
  };

  // --- GAMEPLAY ---
  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: generateId(),
      name,
      score: 0
    };
    setGameState(prev => ({ ...prev, players: [...prev.players, newPlayer] }));
  };

  const startGame = (selectedCategoryIds: string[]) => {
    if (!gameState.activeGroup) return;
    
    const allAvailableCategories = [
        ...gameState.activeGroup.categories,
        ...PRESET_CATEGORIES
    ];

    const gameCategories = allAvailableCategories.filter(c => selectedCategoryIds.includes(c.id));
    
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      categories: gameCategories
    }));
  };

  const openQuestion = (questionId: string) => {
    setGameState(prev => ({
      ...prev,
      status: 'question_active',
      currentQuestionId: questionId,
      buzzedPlayerId: null
    }));
  };

  const closeQuestion = () => {
    setGameState(prev => {
      // Safety check: if no question is active, don't change anything
      if (!prev.currentQuestionId) return prev;

      const newCategories = prev.categories.map(cat => ({
        ...cat,
        questions: (cat.questions || []).map(q => 
          q.id === prev.currentQuestionId ? { ...q, isAnswered: true } : q
        )
      }));
      
      return {
        ...prev,
        status: 'playing',
        currentQuestionId: null,
        categories: newCategories
      };
    });
  };

  const awardPoints = (playerId: string, points: number) => {
    setGameState(prev => {
        // Strict safety check
        if (!prev.currentQuestionId) return prev;

        return {
            ...prev,
            players: prev.players.map(p => p.id === playerId ? { ...p, score: p.score + points } : p),
            status: 'playing', 
            currentQuestionId: null,
            categories: prev.categories.map(cat => ({
                ...cat,
                questions: (cat.questions || []).map(q => 
                    q.id === prev.currentQuestionId ? { ...q, isAnswered: true } : q
                )
            }))
        };
    });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      register, login, logout,
      createGroup, joinGroup,
      createCategory, addQuestion,
      startGame, addPlayer,
      openQuestion, closeQuestion, awardPoints
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
