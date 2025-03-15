import { useChannel } from "@devvit/public-api";
import { GameState } from "./types.js";

/**
 * Game status update subscription function.
 */
export function useGameStateChannel(
  setGameState: (state: GameState) => void
) {
  const realtimeChannel = useChannel({
    name: "gameState_updates",
    onMessage: (newGameState: GameState) => {
      console.log("🔄 Received gameState update:", newGameState);
      setGameState(newGameState);
    },
  });
  
  realtimeChannel.subscribe();
}