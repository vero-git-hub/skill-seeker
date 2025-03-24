// @utils/leaderboard.js
import {Devvit} from '@devvit/public-api';

/**
 * Gets top players from Redis leaderboard.
 * @param {Devvit.Context} context
 * @returns {Promise<{ member: string, score: number }[]>}
 */
export async function getLeaderboard(context: Devvit.Context) {
  const top = await context.redis.zRange('leaderboard', 0, 9, {
    reverse: true,
    by: 'rank',
  });

  return top;
}