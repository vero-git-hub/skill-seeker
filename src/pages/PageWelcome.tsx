// pages/PageWelcome.tsx
import {Devvit} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';

export const PageWelcome = ({setPage, specialists, onInvite}: PageProps & {
  specialists: string[];
  onInvite: () => void;
}) => {
  const firstRow = specialists.slice(0, 4);
  const secondRow = specialists.slice(4);

  return (
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="medium"
      backgroundColor="lightblue"
    >
      <text size="xxlarge">🔮 SkillSeeker 🔮</text>
      <text size="large">Secret society of professionals... Before start, you need: </text>

      <vstack gap="small">
        <text>
          {firstRow.map((spec, index) => `${index + 1}️⃣ ${spec.toUpperCase()} `).join(' ')}
        </text>
        <text>
          {secondRow.map((spec, index) => `${index + 5}️⃣ ${spec.toUpperCase()} `).join(' ')}
        </text>
      </vstack>

      <vstack gap="small">
        <text size="medium">Write in the comment: /join [profession_number]</text>
      </vstack>

      <hstack gap="small">
        <button onPress={onInvite}>📩 Invite Player</button>
        <button onPress={() => setPage('team')}>Start Game</button>
      </hstack>
    </vstack>
  );
}