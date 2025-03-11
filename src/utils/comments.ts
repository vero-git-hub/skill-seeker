// utils/comments.ts
import { RedditAPIClient, useInterval } from "@devvit/public-api";
import { getUserName } from "./users.js";

export function useCommentMonitor(
  monitoring: boolean,
  postId: string,
  reddit: RedditAPIClient,
  specialists: { [key: string]: string },
  updateGameState: (newState: object) => void,
  sendToChannel: (data: { type: string; user: string; profession: string }) => void,
  handleSpecialistFound: (user: string, profession: string) => void,
  requiredSpecialist: string
) {
  async function fetchComments() {
    if (!monitoring) return;

    console.log(`🔄 comments.ts: Checking for a specialist: ${requiredSpecialist}...`);
    const commentsListing = await reddit.getComments({ postId });

    for await (const comment of commentsListing) {
      if (comment.body.startsWith("!join ")) {
        const profession = comment.body.split("!join ")[1].trim();
        if (profession) {
          const userId = comment.authorId ?? "";
          const userName = await getUserName(reddit, userId);
          console.log(`🛠️ ${userName} joined as a ${profession}`);

          if (profession.toLowerCase() === requiredSpecialist.toLowerCase()) {
            console.log(`✅ ${userName} is a ${profession}! Stopping monitor.`);
            handleSpecialistFound(userName, profession);
            interval.stop();
          } else {
            console.log(`⚠️ ${userName} joined as ${profession}, but we need a ${requiredSpecialist}.`);
          }

          updateGameState({
            specialists: { ...specialists, [userName]: profession },
          });

          sendToChannel({ type: "join", user: userName, profession: profession });
        }
      }
    }
  }

  const interval = useInterval(fetchComments, 5000);
  interval.start();
}
