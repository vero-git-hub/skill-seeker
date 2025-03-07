// utils/comments.ts
import { RedditAPIClient, Comment } from "@devvit/public-api";
import { getUserName } from "./users.js";

export async function checkComments(
  postId: string,
  reddit: RedditAPIClient,
  specialists: { [key: string]: string },
  setSpecialists: (value: { [key: string]: string }) => void,
  sendToChannel: (data: { type: string; user: string; profession: string }) => void
) {
  try {
    const commentsListing = await reddit.getComments({ postId });

    for await (const comment of commentsListing) {
      if (comment.body.startsWith("!join ")) {
        const profession = comment.body.split("!join ")[1].trim();
        if (profession) {
          const userId = comment.authorId ?? "";
          if (!userId) {
            console.warn("⚠️ Warning: Comment has no valid authorId.");
            continue;
          }

          const userName = await getUserName(reddit, userId);

          console.log(`🛠️ ${userName} joined as a ${profession}`);
          
          setSpecialists({
            ...specialists,
            [userName]: profession,
          });
                    

          sendToChannel({
            type: "join",
            user: userName,
            profession: profession,
          });
        }
      }
    }
  } catch (error) {
    console.error("❌ Error while retrieving comments:", error);
  }
}
