// pages/PageTeam.tsx
import {Devvit, useInterval, useState} from '@devvit/public-api';
import {PageProps} from '@utils/types.js';
import {BackgroundImage} from "@components/Image.js";

export const PageTeam = ({
  gameState,
  updateGameState,
  reddit,
  postId,
  onInvite,
  onRestart,
}: PageProps & {
  reddit: any;
  postId: string;
  onInvite: () => void;
  onRestart: () => void;
}) => {
  const {teamMembers} = gameState;

  const [monitoring, setMonitoring] = useState(true);
  const [allJoined, setAllJoined] = useState(false);

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

            if (profession in teamMembers) {
              if (teamMembers[profession] === "Waiting...") {
                const updated = {...teamMembers, [profession]: authorName};
                const everyoneReady = Object.values(updated).every(name => name !== "Waiting...");

                if (everyoneReady) {
                  interval.stop();
                  setMonitoring(false);
                  setAllJoined(true);
                  console.log("🛑 All roles filled. Monitoring stopped.");
                }

                console.log(`✅ ${authorName} joined as ${profession}`);
                updateGameState({ teamMembers: updated });
              } else {
                console.log(`⚠️ ${profession} is already taken by ${teamMembers[profession]}`);
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
    <zstack height="100%" width="100%">
      <BackgroundImage url="bg_team.png" description="PageTeam Background" />
      <vstack
        width="100%"
        height="100%"
        alignment="middle center"
        gap="medium"
      >
        <vstack
          gap="medium"
          padding="medium"
          cornerRadius="large"
          backgroundColor="rgba(0, 0, 0, 0.8)"
         >
          <text size="xxlarge" color="white" alignment="middle center">🎯 Team 🎯</text>
          <text size="small" weight="bold" color="white">Write in the comment: /join [profession].</text>
          {Object.entries(teamMembers).map(([profession, player], index) => (
            <text key={index.toString()} size="small" color="white">
              {`${index + 1}️⃣ ${profession.toUpperCase()} - ${player}`}
            </text>
          ))}
        </vstack>

        <hstack gap="small">
          <button
            onPress={() => {
              interval.stop();
              onRestart();
            }}
          >
            ⬅️ Restart
          </button>
          <button onPress={onInvite}>📩 Invite</button>
          <button
            onPress={() => {
              interval.stop();
              updateGameState({page: 'challenge'});
            }}
            disabled={!allJoined}
          >
            Continue ➡️
          </button>
        </hstack>
      </vstack>
    </zstack>
  );
};