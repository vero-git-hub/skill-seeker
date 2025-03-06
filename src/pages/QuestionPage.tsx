// pages/QuestionPage.tsx
import { Devvit } from "@devvit/public-api";

interface QuestionPageProps {
  question: string;
  answers: string[];
  onAnswer: (answer: string) => void;
  message: string;
}

export function QuestionPage({
  question,
  answers,
  onAnswer,
  message,
}: QuestionPageProps) {
  return (
    <vstack height="100%" width="100%" gap="large" alignment="center middle">
      <text size="large" weight="bold">
        ❓ Challenge Question ❓
      </text>
      <text size="medium">{question}</text>

      <hstack gap="medium" alignment="center middle">
        {answers.map((answer, index) => (
          <button
            key={`answer-${index}`}
            appearance="secondary"
            onPress={() => onAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </hstack>

      {message && (
        <text size="medium" alignment="center" wrap>
          {message}
        </text>
      )}
    </vstack>
  );
}
