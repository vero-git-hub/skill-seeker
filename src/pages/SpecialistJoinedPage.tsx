// pages.SpecialistJoinedPage.tsx
import { Devvit, useState, useInterval } from "@devvit/public-api";
import { BackgroundImage } from "@components/Image.js";
import { SpecialistJoinedPageProps } from "@utils/types.js";

export function SpecialistJoinedPage({
  gameState,
  onContinue,
  onRestart,
}: SpecialistJoinedPageProps & {
  gameState: any;
  onContinue: () => void;
  onRestart: () => void;
}) {
  const colors = ["#00FFFF", "#9400D3", "#FFD700", "#FF4500"];
  const [colorIndex, setColorIndex] = useState(0);
  const [isGlowing, setIsGlowing] = useState(true);

  useInterval(() => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  }, 2000).start();

  useInterval(() => {
    setIsGlowing((prev) => !prev);
  }, 1500).start();

  const { user, profession } = gameState.joinedSpecialist || {};

  return (
    <zstack height="100%" width="100%">
      <BackgroundImage url="bg_specialist.png" description="Specialist Joining Background" />

      <vstack height="100%" width="100%" gap="large" alignment="center middle">
        <text size="xlarge" weight="bold" color={colors[colorIndex]} outline="thick">
          ✅ {user} joined as a {profession}!
        </text>
        
        <hstack padding="medium" alignment="center">
          <button
            appearance={isGlowing ? "primary" : "secondary"}
            textColor={isGlowing ? "#FFD700" : "#9400D3"}
            onPress={onContinue}
          >
            🚀 Continue 🚀
          </button>
          <button icon="home" onPress={onRestart} />
        </hstack>
      </vstack>
    </zstack>
  );
}
