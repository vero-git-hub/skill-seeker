// pages/PageTeam.tsx
import {Devvit, useInterval} from '@devvit/public-api'
import {PageProps} from '@utils/types.js'

export const PageTeam = ({setPage, specialists, onInvite, reddit, postId}: PageProps & {
  specialists: string[];
  onInvite: () => void;
  reddit: any;
  postId: string;
}) => {
  const monitoring = true;

  const interval = useInterval(async () => {
      if (!monitoring) return;

      console.log(`🔄 Checking comments for /join...`);
      const commentsListing = await reddit.getComments({postId});

      for await (const comment of commentsListing) {
        const commentBody = comment.body;
        const authorName = comment.authorName;

        if (commentBody.toLowerCase().includes("!join")) {
          console.log(`💬 Found !join comment: ${commentBody} by ${authorName}`);
        }
      }
    }, 5000);

  interval.start();

  return (
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
        
        <text size="small" color="white">Write in the comment: /join [profession_number].</text>

        <hstack gap="small" alignment="middle center">
          <button onPress={() => setPage('welcome')}>⬅️ Restart</button>
          <button onPress={onInvite}>📩 Invite</button>
          <button onPress={() => setPage('challenge')}>Continue ➡️</button>
        </hstack>
      </vstack>
    </vstack>
  );
}