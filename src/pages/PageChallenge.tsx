// pages/PageChallenge.tsx
import {Devvit, useState} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {questions} from '@utils/questions.js';

export const PageChallenge = ({ setPage }: PageProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const totalLevels = questions.length - 1;
  const currentQuestion = questions[currentLevel];
  const professional = questions[currentLevel]?.requiredSpecialist || "unknown specialist";
  const correctAnswer = currentQuestion?.correct;

  if (currentLevel > totalLevels) {
    setPage('victory');
  }

  return (
      <vstack
        width="100%"
        height="100%"
        alignment="middle center"
        gap="large"
        backgroundColor="pink"
      >
        <text size="xxlarge">🏆 Challenge 🏆</text>

        <text size="large">{`Level ${currentLevel + 1} of ${totalLevels + 1}. Question for ${professional}`}:</text>

        <text size="large">
          {questions[currentLevel]?.question || "🎉 Congratulations! You've completed the game!"}
        </text>

        {questions[currentLevel]?.answers ? (
          <hstack gap="medium">
            {questions[currentLevel].answers.map((answer, index) => (
              <button key={index} size="medium" onPress={() => {
                console.log(`✅ Correct Answer: ${correctAnswer}`);
                console.log(`📝 Selected Answer: ${answer}`);

                if (currentLevel < totalLevels) {
                  setCurrentLevel(currentLevel + 1);
                } else {
                  setPage('victory');
                }
              }}>
                {answer}
              </button>
            ))}
          </hstack>
        ) : null}

        <hstack gap="medium">
          <button onPress={() => {setCurrentLevel(0); setPage('welcome');}}>Restart Game</button>
        </hstack>
      </vstack>
    );
}