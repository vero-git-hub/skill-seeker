// utils/comments.ts
import { RedditAPIClient, useInterval } from "@devvit/public-api";
import { getUserName } from "./users.js";

export function useCommentMonitor(
  postId: string,
  reddit: RedditAPIClient,
  setSpecialists: (value: { [key: string]: string }) => void,
  sendToChannel: (data: { type: string; user: string; profession: string }) => void,
  stopMonitoring: () => void
) {
  async function fetchComments() {
    console.log("🔄 Checking for new specialist join requests...");
    const commentsListing = await reddit.getComments({ postId });

    for await (const comment of commentsListing) {
      if (comment.body.startsWith("!join ")) {
        const profession = comment.body.split("!join ")[1].trim();
        if (profession) {
          const userId = comment.authorId ?? "";
          const userName = await getUserName(reddit, userId);
          console.log(`🛠️ ${userName} joined as a ${profession}`);

          setSpecialists((prev) => {
            const updatedSpecialists = { ...prev, [userName]: profession };
            
            if (Object.keys(updatedSpecialists).length > 0) {
              console.log("⏹️ Specialist found, stopping monitoring.");
              stopMonitoring();
              interval.stop();
            }

            return updatedSpecialists;
          });

          sendToChannel({ type: "join", user: userName, profession: profession });
        }
      }
    }
  }

  const interval = useInterval(fetchComments, 5000);
  interval.start();
}
