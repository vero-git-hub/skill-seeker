// utils/sendInvitation.ts
import {RedditAPIClient} from "@devvit/public-api";

export async function sendInvitation(
  reddit: RedditAPIClient,
  username: string,
  postLink: string
): Promise<void> {
  if (!username) {
    console.error("❌ No recipient username provided.");
    return;
  }

  try {
    await reddit.sendPrivateMessage({
      to: username,
      subject: "📩 You've Been Invited to Join the Game!",
      text: `Hey ${username},\n\nYou've been invited to participate in an exciting game! 🎮\n\nClick the link below to join:\n\n${postLink}\n\nLooking forward to seeing you there! 😊`,
    });
  } catch (error) {
    console.error(`❌ Failed to send invitation to ${username}:`, error);
  }
}