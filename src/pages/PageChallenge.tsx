// pages/PageChallenge.tsx
import {Devvit, useState, useInterval, useAsync} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {questions} from '@utils/questions.js';

export const PageChallenge = ({
  setPage,
  teamMembers,
  reddit,
}: PageProps & {
  teamMembers: Record<string, string>;
  reddit: any;
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);
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

  if (currentLevel > totalLevels) {
    setPage('victory');
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
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="large"
      backgroundColor="pink"
    >
      <text size="xxlarge">🏆 Challenge 🏆</text>
      <vstack gap="small" alignment="middle center">
        <text size="medium">{`Level ${currentLevel + 1} of ${totalLevels + 1}. Question for ${professional}`}</text>
        <text size="large">{currentQuestion?.question || "🎉 Congratulations! You've completed the game!"}</text>
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

      <button onPress={() => {setCurrentLevel(0); setPage('welcome');}}>🏠 Restart</button>
    </vstack>
  );
};