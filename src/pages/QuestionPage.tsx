// pages/QuestionPage.tsx
import { Devvit, useState, useInterval } from "@devvit/public-api";
import { BackgroundImage } from "@components/Image.js";
import { QuestionPageProps } from "@utils/types.js";

export function QuestionPage({
  question,
  answers,
  gameState,
  onAnswer,
  onInvite,
  onRestart,
}: QuestionPageProps & { 
  gameState: any; 
  onInvite: () => void;
  onRestart: () => void;
}) {
  const colors = ["#00FFFF", "#9400D3", "#FFD700", "#FF4500"];
  const [colorIndex, setColorIndex] = useState(0);
  const [isGlowing, setIsGlowing] = useState(true);

  useInterval(() => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  }, 2000).start();

  useInterval(() => {
    setIsGlowing((prev) => !prev);
  }, 1500).start();

  return (
    <zstack height="100%" width="100%">
      <BackgroundImage url="bg_question.png" description="SkillSeeker Challenge Background" />

      <vstack height="100%" width="100%" gap="large" alignment="center middle">
        <hstack padding="medium" alignment="center">
          <text size="xxlarge" weight="bold" color={colors[colorIndex]} outline="thick">
            ❓ Challenge Question ❓
          </text>
          <button icon="home" onPress={onRestart} />

          {gameState.players.includes(gameState.currentUser) && (
            <button icon="invite" onPress={onInvite} />
           )}
        </hstack>

        <vstack padding="medium" backgroundColor="rgba(0, 0, 0, 0.5)" cornerRadius="large">
          <text size="large" weight="bold" color="#FFFFFF" outline="thick" alignment="center">
            {question}
          </text>
        </vstack>

        <hstack gap="medium" alignment="center middle">
          {answers.map((answer, index) => (
            <button
              key={`answer-${index}`}
              appearance={isGlowing ? "primary" : "secondary"}
              textColor={isGlowing ? "#FFD700" : "#9400D3"}
              onPress={() => onAnswer(answer)}
            >
              {answer}
            </button>
          ))}
        </hstack>

        {gameState.message && (
          <text size="medium" alignment="center" color="#FFFFFF" wrap>
            {gameState.message}
          </text>
        )}
      </vstack>
    </zstack>
  );
}
