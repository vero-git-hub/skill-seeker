export interface QuestionPageProps {
  question: string;
  answers: string[];
  onAnswer: (answer: string) => void;
  message: string;
}