// pages/PageVictory.tsx
import {Devvit, useAsync} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';

export const PageVictory = ({
  setPage,
  onRestart,
  devvitContext,
}: PageProps & {
  onRestart: () => void;
  devvitContext: Devvit.Context;
}) => {
  useAsync(async () => {
    const username = await devvitContext.reddit.getCurrentUsername();
    if (username) {
      console.log(`🏅 Add a point for ${username}`);
      await devvitContext.redis.zIncrBy('leaderboard', username, 1);
    }
  
    return true;
  });

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