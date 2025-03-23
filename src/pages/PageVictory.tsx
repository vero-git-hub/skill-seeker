import {Devvit} from '@devvit/public-api'
import {PageProps} from '@utils/types.js'

export const PageVictory = ({
  setPage, setTeamMembers, resetTeamMembers
}: PageProps & {
  setTeamMembers: (
    teamOrUpdater:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  resetTeamMembers: () => Record<string, string>;
}) => (
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
        onPress={() => {
          setTeamMembers(resetTeamMembers());
          setPage('welcome');
        }}
      >
        Restart Game
      </button>
    </hstack>
  </vstack>
);