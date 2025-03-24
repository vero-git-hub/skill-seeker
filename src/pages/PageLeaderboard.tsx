// pages/PageLeaderboard.tsx
import {Devvit} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';

export const PageLeaderboard = ({
  setPage,
  leaderboard,
}: PageProps & {
  leaderboard: { member: string, score: number }[];
}) => {
  return (
    <vstack width="100%" height="100%" alignment="middle center" gap="medium" backgroundColor="blue">
      <text size="xxlarge" color="white" weight="bold">🏆 Leaderboard</text>
      <vstack gap="small">
        {leaderboard.map((entry, i) => (
          <hstack key={entry.member} gap="medium" alignment="center">
            <text color="white">{i + 1}.</text>
            <text color="white">{entry.member}</text>
            <text weight="bold" color="yellow">{entry.score}</text>
          </hstack>
        ))}
      </vstack>
      <button onPress={() => setPage('welcome')}>⬅️ Back</button>
    </vstack>
  );
};