// pages/PageWelcome.tsx
import {Devvit} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {BackgroundImage} from "@components/Image.js";

export const PageWelcome = ({
  setPage,
  onShowLeaderboard,
}: PageProps & {
  onShowLeaderboard: () => void;
}) => {
  return (
    <zstack height="100%" width="100%">
      <BackgroundImage url="bg_welcome.png" description="PageWelcome Background" />
      <vstack
        width="100%"
        height="100%"
        alignment="middle center"
        gap="medium"
      >
        <vstack
          gap="medium"
          alignment="middle center"
          padding="medium"
          cornerRadius="large"
          backgroundColor="rgba(0, 0, 0, 0.8)"
         >
          <text size="xxlarge" color="white">🔮 SkillSeeker 🔮</text>
          <text size="xlarge" weight="bold" color="white">Secret society of professionals...</text>
          <text size="large" color="white">Join the challenge and build your team!</text>
        </vstack>

        <hstack gap="medium">
          <button onPress={() => setPage('team')}>Go to Team ➡️</button>
          <button onPress={onShowLeaderboard}>🏆 Leaderboard</button>
        </hstack>
      </vstack>
    </zstack>
  );
}