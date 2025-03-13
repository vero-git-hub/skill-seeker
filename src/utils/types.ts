// utils/types.ts
export interface QuestionPageProps {
  question: string;
  answers: string[];
  onAnswer: (answer: string) => void;
  onRestart: () => void;
}

export interface SpecialistJoinedPageProps {
  onContinue: () => void;
}