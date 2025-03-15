// main.tsx
import { Devvit, useState, useChannel } from "@devvit/public-api";
import { WelcomeScreen } from "@pages/WelcomeScreen.js";
import { ChallengeScreen } from "@pages/ChallengeScreen.js";
import { GameState } from "@utils/types.js";
import { updateGameState } from "@utils/state.js";

Devvit.configure({
  redditAPI: true,
  realtime: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (context) => {
    const [gameState, setGameState] = useState<GameState>({ screen: "welcome" });

    // 🔄 Subscribe to game status updates
    const realtimeChannel = useChannel({
      name: "gameState_updates",
      onMessage: (newGameState: GameState) => {
        console.log("🔄 Received gameState update:", newGameState);
        setGameState(newGameState);
      },
    });

    realtimeChannel.subscribe();

    console.log("🎮 Current gameState:", gameState);

    return gameState.screen === "welcome" ? (
      <WelcomeScreen onStartGame={() => updateGameState({ screen: "challenge" }, context, setGameState)} />
    ) : (
      <ChallengeScreen onGoBack={() => updateGameState({ screen: "welcome" }, context, setGameState)} />
    );
  },
});

export default Devvit;
