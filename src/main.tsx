// main.tsx
import { Devvit, useState } from "@devvit/public-api";
import { WelcomeScreen } from "@pages/WelcomeScreen.js";
import { ChallengeScreen } from "@pages/ChallengeScreen.js";
import { GameState } from "@utils/types.js";
import { updateGameState } from "@utils/state.js";
import { useGameStateChannel } from "@utils/realtime.js";

Devvit.configure({
  redditAPI: true,
  realtime: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (context) => {
    const [gameState, setGameState] = useState<GameState>({ screen: "welcome" });

    useGameStateChannel(setGameState);

    console.log("🎮 Current gameState:", gameState);

    return gameState.screen === "welcome" ? (
      <WelcomeScreen onStartGame={() => updateGameState({ screen: "challenge" }, context, setGameState)} />
    ) : (
      <ChallengeScreen onGoBack={() => updateGameState({ screen: "welcome" }, context, setGameState)} />
    );
  },
});

export default Devvit;
