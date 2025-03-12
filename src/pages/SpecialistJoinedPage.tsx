// pages.SpecialistJoinedPage.tsx
import { Devvit, useState, useInterval } from "@devvit/public-api";
import { BackgroundImage } from "@components/Image.js";
import { SpecialistJoinedPageProps } from "@utils/types.js";

export function SpecialistJoinedPage({
  joinedSpecialist,
  specialists,
  onContinue,
}: SpecialistJoinedPageProps) {
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
      <BackgroundImage url="bg_specialist.png" description="Specialist Joining Background" />

      <vstack height="100%" width="100%" gap="large" alignment="center middle">
        {joinedSpecialist && (
          <text size="xxlarge" weight="bold" color={colors[colorIndex]} outline="thick">
            ✅ {joinedSpecialist.user} joined as a {joinedSpecialist.profession}!
          </text>
        )}

        <button
          appearance={isGlowing ? "primary" : "secondary"}
          textColor={isGlowing ? "#FFD700" : "#9400D3"}
          onPress={onContinue}
        >
          🚀 Continue 🚀
        </button>
      </vstack>
    </zstack>
  );
}
