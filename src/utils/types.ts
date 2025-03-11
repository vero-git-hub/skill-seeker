// utils/types.ts
export interface QuestionPageProps {
  question: string;
  answers: string[];
  onAnswer: (answer: string) => void;
  message: string;
  onRestart: () => void;
}

export interface SpecialistJoinedPageProps {
  joinedSpecialist: { user: string; profession: string } | null;
  specialists: { [key: string]: string };
  onContinue: () => void;
}