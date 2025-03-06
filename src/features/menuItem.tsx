// features/menuItem.ts
import { Devvit } from '@devvit/public-api';

Devvit.addMenuItem({
  label: 'Start SkillSeeker Challenge',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating a SkillSeeker challenge...");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'SkillSeeker Challenge - Can you solve it?',
      subredditName: subreddit.name,
      preview: (
        <vstack padding="medium">
            <hstack backgroundColor="grey">
              <text size="large">🔄 Loading SkillSeeker...</text>
            </hstack>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});
