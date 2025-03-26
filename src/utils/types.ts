// utils/types.ts
export type PageProps = {
  gameState: GameState;
  updateGameState: (partial: Partial<GameState>) => void;
}

export type Question = {
  question: string;
  answers: string[];
  correct: string;
  requiredSpecialist: string;
};

export type GameState = {
  page: string;
  teamMembers: Record<string, string>;
  currentLevel: number;
  selectedQuestions: Question[] | null;
  specialists: string[];
};