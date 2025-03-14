// pages/WelcomeScreen.tsx
import { Devvit, useState } from "@devvit/public-api";
import { BackgroundImage } from "@components/Image.js";

export function WelcomeScreen({ onStartGame }: { onStartGame: () => void }) {
  const colors = ["#00FFFF", "#9400D3", "#FFD700", "#FF4500"];
  const [colorIndex, setColorIndex] = useState(0);

  return (
    <zstack height="100%" width="100%">
      <BackgroundImage url="bg.png" description="SkillSeeker Background" />
      
      <vstack height="100%" width="100%" gap="large" alignment="center middle">
        <text size="xxlarge" weight="bold" color={colors[colorIndex]} outline="thick">
          🔮 SkillSeeker 🔮
        </text>

        <text size="medium" color="silver" alignment="center">
          A world of enigmatic puzzles and futuristic mysteries awaits you...
        </text>

        <text size="medium" color="gold" alignment="center">
          Dare to enter? 🔑
        </text>

        <button
          appearance="primary"
          onPress={() => {
            console.log("🖱️ Button clicked in WelcomeScreen!");
            onStartGame();
          }}
        >
          🚀 Begin the Journey 🚀
        </button>
      </vstack>
    </zstack>
  );
}
