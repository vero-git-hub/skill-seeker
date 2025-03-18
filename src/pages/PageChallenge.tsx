import {Devvit} from '@devvit/public-api'
import {PageProps} from '@utils/types.js'

export const PageChallenge = ({ setPage }: PageProps) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="pink"
  >
    <text size="xxlarge">🏆 Challenge 🏆</text>
    <text size="large">In what country was Reddit created?</text>
    <hstack gap="medium">
      <button size="medium">USA</button>
      <button size="medium">Canada</button>
      <button size="medium">India</button>
    </hstack>
    <hstack gap="medium">
      <button onPress={() => setPage('welcome')}>Restart Game</button>
      <button onPress={() => setPage('victory')}>Victory(temp)</button>
    </hstack>
  </vstack>
);