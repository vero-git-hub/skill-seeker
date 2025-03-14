// utils/types.ts
export interface ChallengeScreenProps {
  question: string;
  answers: string[];
  onAnswer: (answer: string) => void;
  onRestart: () => void;
}

export interface SpecialistJoinedPageProps {
  onContinue: () => void;
}