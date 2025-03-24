// pages/PageVictory.tsx
import {Devvit} from '@devvit/public-api'
import {PageProps} from '@utils/types.js'

export const PageVictory = ({
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
      backgroundColor="gray"
    >
      <text size="xxlarge" color="white">🎉 Victory 🎉</text>
      <text size="large" color="white">Congratulations! Your team of professionals has won.</text>
      <hstack gap="medium">
        <button
          onPress={onRestart}
        >
          Restart Game
        </button>
      </hstack>
    </vstack>
  );
};