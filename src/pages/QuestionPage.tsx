// pages/QuestionPage.tsx
import { Devvit } from "@devvit/public-api";

interface QuestionPageProps {
  question: string;
  answers: string[];
  onAnswer: (answer: string) => void;
}

export function QuestionPage({
  question,
  answers,
  onAnswer,
}: QuestionPageProps) {
  return (
    <vstack height="100%" width="100%" gap="large" alignment="center middle">
      <text size="large" weight="bold">
        ❓ Challenge Question ❓
      </text>
      <text size="medium">{question}</text>

      {answers.map((answer, index) => (
        <button
          key={String(index)}
          appearance="secondary"
          onPress={() => onAnswer(answer)}
        >
          {answer}
        </button>
      ))}
    </vstack>
  );
}
