// pages/PageVictory.tsx
import {Devvit, useAsync} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';

export const PageVictory = ({
  setPage,
  onRestart,
  devvitContext,
  teamMembers,
}: PageProps & {
  onRestart: () => void;
  devvitContext: Devvit.Context;
  teamMembers: Record<string, string>;
}) => {
  useAsync(async () => {
    const username = await devvitContext.reddit.getCurrentUsername();

    const isPlayerInTeam = Object.values(teamMembers).some(
      member => member.toLowerCase() === username?.toLowerCase()
    );

    if (username && isPlayerInTeam) {
      console.log(`🏅 ${username} — team member - 1 point`);
      await devvitContext.redis.zIncrBy('leaderboard', username, 1);
    } else {
      console.log(`🚫 ${username} not on team - no point awarded`);
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