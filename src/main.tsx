// main.tsx
import { Devvit } from '@devvit/public-api';
import { ChallengePost } from '@components/ChallengePost.js';
import './features/menuItem';

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: 'SkillSeeker Post',
  height: 'regular',
  render: ChallengePost,
});

export default Devvit;
