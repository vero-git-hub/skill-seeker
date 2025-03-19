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
        <text key={index.toString()} size="small" color="white">
          {`${index + 1}️⃣ ${spec.toUpperCase()} - `}
        </text>
      ))}
      
      <text size="small" color="white">Write in the comment: /join [profession_number]. Example: /join 7</text>

      <hstack gap="small" alignment="middle center">
        <button onPress={() => setPage('welcome')}>⬅️ Restart</button>
        <button onPress={onInvite}>📩 Invite</button>
        <button onPress={() => setPage('challenge')}>Continue ➡️</button>
      </hstack>
    </vstack>
  </vstack>
);