// pages/PageTeam.tsx
import {Devvit, useInterval, useState} from '@devvit/public-api';
import {PageProps, Question} from '@utils/types.js';
import {pickRandomQuestions} from '@utils/questions.js';

export const PageTeam = ({
  setPage,
  onInvite,
  reddit,
  postId,
  teamMembers,
  setTeamMembers,
  onRestart,
  selectedQuestions,
  setSelectedQuestions,
  setSpecialists,
  context
}: PageProps & {
  onInvite: () => void;
  reddit: any;
  postId: string;
  teamMembers: Record<string, string>;
  setTeamMembers: (
    teamOrUpdater:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  onRestart: () => void;
  selectedQuestions: Question[] | null;
  setSelectedQuestions: (q: Question[]) => void;
  setSpecialists: (s: string[]) => void;
  context: any;
}) => {
  const [monitoring, setMonitoring] = useState(true);
  const [allJoined, setAllJoined] = useState(false);

  if (!selectedQuestions) {
    console.log("⚙️ Initializing game from PageTeam...");
  
    const newSet = pickRandomQuestions(5);
    const newSpecs = [...new Set(newSet.map(q => q.requiredSpecialist))];
  
    context.realtime.send('question_set', newSet);
    context.realtime.send('specialists_sync', newSpecs);
  
    setSelectedQuestions(newSet);
    setSpecialists(newSpecs);
    setTeamMembers(
      Object.fromEntries(newSpecs.map(spec => [spec.toLowerCase(), "Waiting..."]))
    );
  }  

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
                setTeamMembers(updated);
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
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="large"
      backgroundColor="green"
    >
      <text size="xxlarge" color="white">🎯 Team 🎯</text>
      <vstack gap="small">
        <text size="small" color="white">Write in the comment: /join [profession].</text>
        {Object.entries(teamMembers).map(([profession, player], index) => (
          <text key={index.toString()} size="small" color="white">
            {`${index + 1}️⃣ ${profession.toUpperCase()} - ${player}`}
          </text>
        ))}
        <hstack gap="small" alignment="middle center">
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
              setPage('challenge');
            }}
            disabled={!allJoined}
          >
            Continue ➡️
          </button>
        </hstack>
      </vstack>
    </vstack>
  );
};