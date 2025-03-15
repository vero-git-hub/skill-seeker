// main.tsx
import { Devvit, useState, useChannel } from "@devvit/public-api";
import { WelcomeScreen } from "@pages/WelcomeScreen.js";
import { ChallengeScreen } from "@pages/ChallengeScreen.js";
import { GameState } from "@utils/types.js";

Devvit.configure({
  redditAPI: true,
  realtime: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (context) => {
    const [gameState, setGameState] = useState<GameState>({ screen: "welcome" });

    // 🔄 State update function
    function updateGameState(newState: GameState) {
      console.log("📢 Changing screen to:", newState.screen);

      context.realtime.send("gameState_updates", newState);

      setGameState(newState);
    }

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
      <WelcomeScreen onStartGame={() => updateGameState({ screen: "challenge" })} />
    ) : (
      <ChallengeScreen onGoBack={() => updateGameState({ screen: "welcome" })} />
    );
  },
});

export default Devvit;
