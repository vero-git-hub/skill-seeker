import {Devvit} from '@devvit/public-api'
import {PageProps} from '@utils/types.js'

export const PageTeam = ({setPage, specialists, onInvite}: PageProps & {
  specialists: string[];
  onInvite: () => void;
}) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="green"
  >
    <text size="xxlarge" color="white">🎯 Team 🎯</text>
    <vstack gap="small">
      {specialists.map((spec, index) => (
        <text key={index} size="small" color="white">
          {`${index + 1}️⃣ ${spec.toUpperCase()} - `}
        </text>
      ))}
    </vstack>
    <hstack gap="small">
      <button onPress={() => setPage('welcome')}>Restart Game</button>
      <button onPress={onInvite}>📩 Invite Player</button>
      <button onPress={() => setPage('challenge')}>Continue</button>
    </hstack>
  </vstack>
);