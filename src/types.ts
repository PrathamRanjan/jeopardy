export interface Question {
  id: string;
  points: number;
  question: string;
  answer: string;
  isAnswered: boolean;
}

export interface Category {
  id: string;
  title: string;
  questions: Question[];
  roomId?: string; // Optional: Links to a specific room
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface User {
  username: string;
  isAdmin: boolean;
}

export interface Group {
  id: string;
  name: string;
  // Passcode is not needed in frontend state usually, but good for type consistency if needed
  categories: Category[]; 
}

export interface GameState {
  status: 'auth' | 'lobby' | 'playing' | 'question_active' | 'finished';
  currentUser: User | null;
  activeGroup: Group | null;
  categories: Category[]; // Selected for game
  players: Player[];
  currentQuestionId: string | null;
  buzzedPlayerId: string | null;
}
