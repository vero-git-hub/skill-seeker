// utils/comments.ts
import { RedditAPIClient, useInterval } from "@devvit/public-api";
import { getUserName } from "./users.js";

export function useCommentMonitor(
  postId: string,
  reddit: RedditAPIClient,
  specialists: { [key: string]: string },
  setSpecialists: (value: { [key: string]: string }) => void,
  sendToChannel: (data: { type: string; user: string; profession: string }) => void,
  stopMonitoring: () => void,
  requiredSpecialist: string
) {
  async function fetchComments() {
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
            stopMonitoring();
            interval.stop();
          } else {
            console.log(`⚠️ ${userName} joined as ${profession}, but we need a ${requiredSpecialist}.`);
          }

          const updatedSpecialists = { ...specialists, [userName]: profession };
          setSpecialists(updatedSpecialists);

          sendToChannel({ type: "join", user: userName, profession: profession });
        }
      }
    }
  }

  const interval = useInterval(fetchComments, 5000);
  interval.start();
}
