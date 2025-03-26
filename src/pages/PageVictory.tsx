// pages/PageVictory.tsx
import {Devvit, useAsync} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {BackgroundImage} from "@components/Image.js";

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
    <zstack height="100%" width="100%">
          <BackgroundImage url="bg_victory.png" description="PageVictory Background" />
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
          <text size="xxlarge" color="white">🎉 Victory 🎉</text>
          <text size="large" color="white">Congratulations! Your team of professionals has won.</text>
        </vstack>
        <hstack gap="medium">
          <button
            onPress={onRestart}
          >
            Restart Game
          </button>
        </hstack>
      </vstack>
    </zstack>
  );
};