// pages/PageChallenge.tsx
import {Devvit, useState} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {questions} from '@utils/questions.js';

export const PageChallenge = ({ setPage }: PageProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const totalLevels = questions.length;
  const professional = 'redditor';

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

        <text size="large">{`Level ${currentLevel} of ${totalLevels}. Question for ${professional}`}:</text>

        <text size="large">
          {questions[currentLevel - 1]?.question}
        </text>

        // TODO: The answers depends on the level.
        <hstack gap="medium">
          <button size="medium">USA</button>
          <button size="medium">Canada</button>
          <button size="medium">India</button>
        </hstack>
        <hstack gap="medium">
          <button onPress={() => {setCurrentLevel(1); setPage('welcome');}}>Restart Game</button>
          <button onPress={() => {setCurrentLevel(currentLevel + 1); setPage('challenge');}}>Answer(temp)</button>
          <button onPress={() => setPage('victory')}>Victory(temp)</button>
        </hstack>
      </vstack>
    );
}