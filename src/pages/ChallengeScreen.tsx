// pages/ChallengeScreen.tsx
import { Devvit } from "@devvit/public-api";
import { BackgroundImage } from "@components/Image.js";

export function ChallengeScreen() {
  console.log("🏆 ChallengeScreen rendered!");

  return (
    <zstack height="100%" width="100%">
      <BackgroundImage url="challenge_bg.png" description="Challenge Background" />

      <vstack height="100%" width="100%" gap="large" alignment="center middle">
        <text size="xxlarge" weight="bold" color="gold" outline="thick">
          🏆 Welcome to the Challenge! 🏆
        </text>

        <text size="medium" color="silver" alignment="center">
          Solve the puzzles to move forward!
        </text>
      </vstack>
    </zstack>
  );
}