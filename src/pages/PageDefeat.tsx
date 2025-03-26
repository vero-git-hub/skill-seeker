// pages/PageDefeat.tsx
import {Devvit} from '@devvit/public-api';
import {BackgroundImage} from "@components/Image.js";

export const PageDefeat = ({
  onRestart,
}: {
  onRestart: () => void;
}) => {
  return (
    <zstack height="100%" width="100%">
      <BackgroundImage url="bg_defeat.png" description="PageDefeat Background" />
      <vstack
        width="100%"
        height="100%"
        alignment="middle center"
        gap="large"
      >
        <vstack
          gap="medium"
          alignment="middle center"
          padding="medium"
          cornerRadius="large"
          backgroundColor="rgba(0, 0, 0, 0.8)"
        >
          <text size="xxlarge" weight="bold" color="white">💥 Defeat 💥</text>
          <text size="large" color="white">You team failed the challenge!</text>
          <text size="medium" color="white">Better luck next time.</text>
        </vstack>
        <button
          appearance="primary"
          onPress={onRestart}
        >
          🔁 Restart Game
        </button>
      </vstack>
    </zstack>
  );
};