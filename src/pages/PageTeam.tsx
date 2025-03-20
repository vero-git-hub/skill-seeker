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

  const teamMembers = new Map<string, string>();
  specialists.forEach(profession => {
    teamMembers.set(profession.toLowerCase(), "Waiting...");
  });

  const interval = useInterval(async () => {
      if (!monitoring) return;

      console.log(`🔄 Checking comments for /join...`);
      const commentsListing = await reddit.getComments({postId});

      for await (const comment of commentsListing) {
        const commentBody = comment.body.toLowerCase();
        const authorName = comment.authorName;

        if (commentBody.includes("!join")) {
          console.log(`💬 Found !join comment: ${commentBody} by ${authorName}`);

          const match = commentBody.match(/!join (\w+)/);
          if (match) {
            const profession = match[1].toLowerCase();

            if (teamMembers.has(profession)) {
              if (teamMembers.get(profession) === "Waiting...") {
                teamMembers.set(profession, authorName);
                console.log(`✅ ${authorName} joined as ${profession}`);
                console.log("📊 Updated teamMembers:", [...teamMembers.entries()]);
              } else {
                console.log(`⚠️ ${profession} is already taken by ${teamMembers.get(profession)}`);
              }
            } else {
              console.log(`❌  ${profession} is not a valid role.`);
            }
          }
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
        {[...teamMembers.keys()].map((profession, index) => (
          <text key={index.toString()} size="small" color="white">
            {`${index + 1}️⃣ ${profession.toUpperCase()} - `}
          </text>
        ))}
        
        <text size="small" color="white">Write in the comment: /join [profession].</text>

        <hstack gap="small" alignment="middle center">
          <button onPress={() => setPage('welcome')}>⬅️ Restart</button>
          <button onPress={onInvite}>📩 Invite</button>
          <button onPress={() => setPage('challenge')}>Continue ➡️</button>
        </hstack>
      </vstack>
    </vstack>
  );
}