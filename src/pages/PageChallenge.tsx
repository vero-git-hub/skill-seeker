// pages/PageChallenge.tsx
import {Devvit, useState} from '@devvit/public-api'
import {PageProps} from '@utils/types.js'

export const PageChallenge = ({ setPage }: PageProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const totalLevels = 5;

  return (
      <vstack
        width="100%"
        height="100%"
        alignment="middle center"
        gap="large"
        backgroundColor="pink"
      >
        <text size="xxlarge">🏆 Challenge 🏆</text>

        <text size="large">Level {currentLevel} / {totalLevels}. Question for a redditor:</text>

        // TODO: The question depends on the level.

        <text size="large">In what country was Reddit created?</text>
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