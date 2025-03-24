// pages/PageLeaderboard.tsx
import {Devvit, useAsync} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {getLeaderboard} from '@utils/leaderboard.js';

export const PageLeaderboard = ({
  setPage,
  devvitContext,
}: PageProps & { devvitContext: Devvit.Context }) => {
  const { data: leaderboard, loading, error } = useAsync(async () => {
    return await getLeaderboard(devvitContext);
  });

  return (
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="large"
      backgroundColor="blue"
    >
      <text size="xxlarge" color="white">🏆 Leaderboard</text>

      {loading && <text color="white">Loading...</text>}
      {error && <text color="red">Error loading leaderboard</text>}

      {leaderboard && leaderboard.length > 0 ? (
        <vstack gap="small">
          {leaderboard.map((entry, index) => (
            <hstack key={entry.member} gap="medium" alignment="center">
              <text color="white">{index + 1}.</text>
              <text color="white">{entry.member}</text>
              <text color="yellow" weight="bold">{entry.score}</text>
            </hstack>
          ))}
        </vstack>
      ) : (
        !loading && <text color="white">No scores yet.</text>
      )}

      <button onPress={() => setPage('welcome')}>⬅️ Back</button>
    </vstack>
  );
};