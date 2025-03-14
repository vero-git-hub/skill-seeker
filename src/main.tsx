// main.tsx
import { Devvit, useState } from "@devvit/public-api";
import { WelcomeScreen } from "@pages/WelcomeScreen.js";
import { ChallengeScreen } from "@pages/ChallengeScreen.js";

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (context) => {
    console.log("App started...");

    const [gameState, setGameState] = useState({ screen: "welcome" });

    (async () => {
      console.log("🔄 Loading game state from cache...");
      let cachedState = await context.cache(
        async () => ({ screen: "welcome" }),
        { key: "gameState", ttl: 60 * 1000 }
      );
      console.log("📦 Cached gameState:", cachedState);
      setGameState(cachedState);
    })();

    function handleStartGame() {
      console.log("🚀 Starting game...");
      const newState = { screen: "challenge" };
      setGameState(newState);
      context.cache(() => newState, { key: "gameState", ttl: 60 * 1000 });
    }

    console.log("🎮 Current gameState:", gameState);

    return gameState.screen === "welcome" ? (
      <WelcomeScreen onStartGame={handleStartGame} />
    ) : (
      <ChallengeScreen />
    );
  },
});

export default Devvit;
