// pages/PageDefeat.tsx
import {Devvit} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';

export const PageDefeat = ({
  setPage,
  onRestart,
}: PageProps & {
  onRestart: () => void;
}) => {
  return (
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="large"
      backgroundColor="red"
    >
      <text size="xxlarge" weight="bold" color="white">💥 Defeat 💥</text>
      <text size="large" color="white">You team failed the challenge!</text>
      <text size="medium" color="white">Better luck next time.</text>

      <button
        appearance="primary"
        onPress={onRestart}
      >
        🔁 Restart Game
      </button>
    </vstack>
  );
};