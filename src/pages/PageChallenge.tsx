// pages/PageChallenge.tsx
import {Devvit, useState, useInterval, useAsync} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {Question} from '@utils/types.js';
import {BackgroundImage} from "@components/Image.js";

export const PageChallenge = ({
  setPage,
  reddit,
  teamMembers,
  currentLevel,
  setCurrentLevel,
  questions,
}: PageProps & {
  reddit: any;
  teamMembers: Record<string, string>;
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  questions: Question[];
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shouldAdvance, setShouldAdvance] = useState(false);

  const totalLevels = questions.length - 1;
  const currentQuestion = questions[currentLevel];
  const correctAnswer = currentQuestion?.correct;

  const professional = currentQuestion?.requiredSpecialist || "unknown specialist";
  const assignedPlayer = teamMembers[professional.toLowerCase()];

  const {data: currentUser} = useAsync(async () => {
    const username = await reddit.getCurrentUsername();
    return username;
  });

  const isUserAllowed =
    currentUser && assignedPlayer &&
    currentUser.toLowerCase() === assignedPlayer.toLowerCase();

  if (!currentUser || !assignedPlayer) {
    return (
      <vstack
        width="100%"
        height="100%"
        alignment="center middle"
        backgroundColor="pink"
        gap="large"
      >
        <text size="xxlarge">🏃‍♀️ Loading...</text>
        <text size="medium">Fetching player info...</text>
      </vstack>
    );
  }

  const navigationInterval = useInterval(() => {
    if (shouldAdvance) {
      setShouldAdvance(false);
      setSelectedAnswer(null);
      if (currentLevel < totalLevels) {
        setCurrentLevel(currentLevel + 1);
      } else {
        setPage('victory');
      }
      navigationInterval.stop();
    }
  }, 1000);

  return (
    <zstack height="100%" width="100%">
          <BackgroundImage url="bg_challenge.png" description="PageChallenge Background" />
      <vstack
        width="100%"
        height="100%"
        alignment="middle center"
        gap="large"
      >
        <vstack
          gap="medium"
          alignment="middle center"
          padding="medium"
          cornerRadius="large"
          backgroundColor="rgba(0, 0, 0, 0.8)"
         >
          <text size="xxlarge" color="white">🏆 Challenge 🏆</text>
          <vstack gap="small" alignment="middle center">
            <text size="medium" color="white">{`Level ${currentLevel + 1} of ${totalLevels + 1}. Question for ${professional}`}</text>
            <text size="large" alignment="middle center" weight="bold" color="white" wrap>{currentQuestion?.question || "🎉 Congratulations! You've completed the game!"}</text>
            <text size="small" color="red">
              {isUserAllowed
                ? `✅ It's your turn, ${currentUser}!`
                : `⛔ Only ${assignedPlayer} can answer this question.`}
            </text>
          </vstack>

          {currentQuestion?.answers ? (
            <hstack gap="medium">
              {currentQuestion.answers.map((answer, index) => {
                let buttonAppearance: "secondary" | "destructive" | "success" = "secondary";

                if (selectedAnswer) {
                  if (answer === correctAnswer) {
                    buttonAppearance = "secondary";
                  } else if (answer === selectedAnswer) {
                    buttonAppearance = "destructive";
                  }
                }

                return (
                  <button
                    key={index.toString()}
                    size="medium"
                    appearance={buttonAppearance}
                    disabled={!isUserAllowed || shouldAdvance}
                    onPress={() => {
                      if (!isUserAllowed || shouldAdvance) return;
                      setSelectedAnswer(answer);

                      if (answer === correctAnswer) {
                        setShouldAdvance(true);
                        navigationInterval.start();
                      } else {
                        setPage('defeat');
                      }
                    }}
                  >
                    {answer}
                  </button>
                );
              })}
            </hstack>
          ) : null}
        </vstack>
      </vstack>
    </zstack>
  );
};