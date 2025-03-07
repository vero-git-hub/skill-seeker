// utils/users.ts
import { RedditAPIClient } from "@devvit/public-api";

export async function getUserName(reddit: RedditAPIClient, authorId: string): Promise<string> {
  try {
    const user = await reddit.getUserById(authorId);

    if (!user) {
      console.warn(`⚠️ User with ID ${authorId} not found.`);
      return "Unknown";
    }

    console.log("🔍 Fetched user:", user);
    return user.username ?? "Unknown";
  } catch (error) {
    console.error("❌ Error fetching username:", error);
    return "Unknown";
  }
}
