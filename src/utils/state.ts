import { GameState } from "@utils/types.js";

/**
 * Update game state and send in realtime.
 */
export function updateGameState(
  newState: GameState,
  context: any,
  setGameState: (state: GameState) => void,
) {
  console.log("📢 Changing screen to:", newState.screen);

  context.realtime.send("gameState_updates", newState);

  setGameState(newState);
}