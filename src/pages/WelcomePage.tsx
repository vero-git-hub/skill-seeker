import { Devvit, useState, useInterval } from "@devvit/public-api";
import { BackgroundImage } from "@components/Image.js";

export function WelcomePage({ onStartGame }: { onStartGame: () => void }) {
  const colors = ["#00FFFF", "#9400D3", "#FFD700", "#FF4500"];
  const [colorIndex, setColorIndex] = useState(0);
  const [isGlowing, setIsGlowing] = useState(true);

  useInterval(() => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  }, 2000).start();

  useInterval(() => {
    setIsGlowing((prev) => !prev);
  }, 1500).start();

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
          onPress={onStartGame}
        >
          🚀 Begin the Journey 🚀
        </button>
      </vstack>
    </zstack>
  );
}
