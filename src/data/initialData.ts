import type { Category } from "../types";

const createId = () => Math.random().toString(36).substr(2, 9);

export const PRESET_CATEGORIES: Category[] = [
  {
    id: 'ntu-trivia',
    title: 'NTU Trivia',
    questions: [
      { id: createId(), points: 100, question: "This iconic building, resembling a dim sum basket, is a hub for learning.", answer: "The Hive", isAnswered: false },
      { id: createId(), points: 200, question: "NTU's mascot is this animal.", answer: "Lion", isAnswered: false },
      { id: createId(), points: 300, question: "The name of the autonomous bus often seen plying NTU roads.", answer: "MooVita (or the NTU-Bolloré Blue Solutions)", isAnswered: false }, 
      { id: createId(), points: 400, question: "This NTU hall is known for being the 'Sports Hall' and often wins Inter-Hall Games.", answer: "Hall 3 (or Hall 16 - debatable but often Hall 3)", isAnswered: false },
      { id: createId(), points: 500, question: "The year Nanyang Technological University was inaugurated.", answer: "1991", isAnswered: false },
    ]
  },
  {
    id: 'sg-trivia',
    title: 'Singapore Trivia',
    questions: [
      { id: createId(), points: 100, question: "The Merlion has the head of a lion and the body of a...", answer: "Fish", isAnswered: false },
      { id: createId(), points: 200, question: "This fruit is banned on the MRT due to its smell.", answer: "Durian", isAnswered: false },
      { id: createId(), points: 300, question: "Singapore's National Flower.", answer: "Vanda Miss Joaquim", isAnswered: false },
      { id: createId(), points: 400, question: "The year Singapore gained independence.", answer: "1965", isAnswered: false },
      { id: createId(), points: 500, question: "The name of the island Singapore was known as in the 14th century.", answer: "Temasek", isAnswered: false },
    ]
  },
  {
    id: 'india-trivia',
    title: 'India Trivia',
    questions: [
      { id: createId(), points: 100, question: "The capital city of India.", answer: "New Delhi", isAnswered: false },
      { id: createId(), points: 200, question: "This monument was built by Shah Jahan for his wife Mumtaz Mahal.", answer: "Taj Mahal", isAnswered: false },
      { id: createId(), points: 300, question: "The national sport of India (de facto field game).", answer: "Hockey", isAnswered: false },
      { id: createId(), points: 400, question: "He is known as the 'Father of the Nation'.", answer: "Mahatma Gandhi", isAnswered: false },
      { id: createId(), points: 500, question: "The ISRO mission that successfully reached Mars in its first attempt.", answer: "Mangalyaan (Mars Orbiter Mission)", isAnswered: false },
    ]
  },
  {
    id: 'football',
    title: 'Football',
    questions: [
      { id: createId(), points: 100, question: "This player has won the most Ballon d'Or awards.", answer: "Lionel Messi", isAnswered: false },
      { id: createId(), points: 200, question: "The country that won the 2018 FIFA World Cup.", answer: "France", isAnswered: false },
      { id: createId(), points: 300, question: "This English club plays at Old Trafford.", answer: "Manchester United", isAnswered: false },
      { id: createId(), points: 400, question: "The term for scoring three goals in a single game.", answer: "Hat-trick", isAnswered: false },
      { id: createId(), points: 500, question: "The only goalkeeper to win the Ballon d'Or.", answer: "Lev Yashin", isAnswered: false },
    ]
  },
  {
    id: 'movies',
    title: 'Movies',
    questions: [
      { id: createId(), points: 100, question: "He says 'I'll be back' in The Terminator.", answer: "Arnold Schwarzenegger", isAnswered: false },
      { id: createId(), points: 200, question: "The highest-grossing film of all time (as of 2024).", answer: "Avatar", isAnswered: false },
      { id: createId(), points: 300, question: "The fictional metal that Captain America's shield is made of.", answer: "Vibranium", isAnswered: false },
      { id: createId(), points: 400, question: "The first animated film to be nominated for Best Picture at the Oscars.", answer: "Beauty and the Beast", isAnswered: false },
      { id: createId(), points: 500, question: "The name of the sled in Citizen Kane.", answer: "Rosebud", isAnswered: false },
    ]
  },
  {
    id: 'tv-shows',
    title: 'TV Shows',
    questions: [
      { id: createId(), points: 100, question: "The coffee shop where the 'Friends' gang hangs out.", answer: "Central Perk", isAnswered: false },
      { id: createId(), points: 200, question: "In 'Game of Thrones', this family's motto is 'Winter is Coming'.", answer: "Stark", isAnswered: false },
      { id: createId(), points: 300, question: "The teacher turned drug lord in 'Breaking Bad'.", answer: "Walter White", isAnswered: false },
      { id: createId(), points: 400, question: "The fictional paper company in 'The Office' (US).", answer: "Dunder Mifflin", isAnswered: false },
      { id: createId(), points: 500, question: "The longest-running animated sitcom in US history.", answer: "The Simpsons", isAnswered: false },
    ]
  }
];