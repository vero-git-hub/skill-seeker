// main.tsx
import { Devvit, useState } from "@devvit/public-api";
import { WelcomeScreen } from "@pages/WelcomeScreen.js";
import { ChallengeScreen } from "@pages/ChallengeScreen.js";
import { GameState } from "@utils/types.js";

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: () => {
    const [gameState, setGameState] = useState<GameState>({ screen: "welcome" });

    function updateGameState(newState: GameState) {
      console.log("📢 Changing screen to:", newState.screen);
      setGameState(newState);
    }

    console.log("🎮 Current gameState:", gameState);

    return gameState.screen === "welcome" ? (
      <WelcomeScreen onStartGame={() => updateGameState({ screen: "challenge" })} />
    ) : (
      <ChallengeScreen onGoBack={() => updateGameState({ screen: "welcome" })} />
    );
  },
});

export default Devvit;
