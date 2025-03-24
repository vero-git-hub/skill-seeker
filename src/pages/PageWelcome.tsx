// pages/PageWelcome.tsx
import {Devvit} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';

export const PageWelcome = ({
  setPage,
  onShowLeaderboard,
}: PageProps & {
  onShowLeaderboard: () => void;
}) => {
  return (
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="medium"
      backgroundColor="lightblue"
    >
      <vstack gap="medium" alignment="middle center">
        <text size="xxlarge">🔮 SkillSeeker 🔮</text>
        <text size="xlarge">Secret society of professionals...</text>
        <text size="large">Join the challenge and build your team!</text>
      </vstack>

      <hstack gap="medium">
        <button onPress={() => setPage('team')}>Go to Team ➡️</button>
        <button onPress={onShowLeaderboard}>🏆 Leaderboard</button>
      </hstack>
    </vstack>
  );
}