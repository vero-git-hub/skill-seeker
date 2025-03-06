// pages/WelcomePage.tsx
import { Devvit } from "@devvit/public-api";

export function WelcomePage({ onStartGame }: { onStartGame: () => void }) {
  return (
    <vstack
      height="100%"
      width="100%"
      gap="large"
      alignment="center middle"
      backgroundColor="black"
    >
      <text size="xlarge" weight="bold" color="neon-blue">
        🔮 Welcome to SkillSeeker 🔮
      </text>
      <text size="medium" color="silver" alignment="center">
        A world of enigmatic puzzles and futuristic mysteries awaits you...
      </text>
      <text size="medium" color="silver" alignment="center">
        Dare to enter?
      </text>

      <button
        appearance="primary"
        onPress={onStartGame}
      >
        Begin the Journey
      </button>
    </vstack>
  );
}
