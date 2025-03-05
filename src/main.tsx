import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

async function updatePost(post, reddit, currentLevel, waitingForRole, currentQuestion, activePlayer) {
  await post.edit(`🔄 **SkillSeeker Challenge**  
  - Current level: ${currentLevel}  
  - ${waitingForRole ? `Specialist required: ${waitingForRole}` : `Currently playing: ${activePlayer || 'nobody'}`}  
  - Next question: ${currentQuestion}  
  - To join, write \`!join ${waitingForRole}\``);
}

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
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading SkillSeeker...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

Devvit.addCustomPostType({
  name: 'SkillSeeker Post',
  height: 'regular',
  render: (context) => {
    const { reddit, post } = context;
    const [message, setMessage] = useState("");
    const [currentLevel, setCurrentLevel] = useState(1);
    const [waitingForRole, setWaitingForRole] = useState("engineer");
    const [currentQuestion, setCurrentQuestion] = useState("In what country was Reddit created?");
    const [activePlayer, setActivePlayer] = useState(null);

    async function checkAnswer(selectedAnswer) {
      if (currentLevel === 1 && selectedAnswer === "USA") {
        const newLevel = 2;
        const newRole = "engineer";
        const newQuestion = "What law describes the relationship between voltage, current and resistance?";
    
        setCurrentLevel(newLevel);
        setWaitingForRole(newRole);
        setCurrentQuestion(newQuestion);
        setMessage("✅ Right! Now find an engineer.");
    
        if (post) {
          await updatePost(post, reddit, newLevel, newRole, newQuestion, activePlayer);
        } else {
          console.error("❌ Error: `post` not found!");
        }
      } else {
        setMessage("❌ Wrong answer. Try again!");
      }
    }    

    return (
      <vstack height="100%" width="100%" gap="medium" alignment="center middle">
        <text size="large" weight="bold">🔑 SkillSeeker Challenge 🔑</text>
        <text size="medium">{currentQuestion}</text>

        <button
          appearance="primary"
          onPress={async () => checkAnswer("USA")}
        >
          USA
        </button>

        <button
          appearance="secondary"
          onPress={async () => checkAnswer("Canada")}
        >
          Canada
        </button>

        <button
          appearance="secondary"
          onPress={async () => checkAnswer("UK")}
        >
          UK
        </button>

        <text size="small">{message}</text>
      </vstack>
    );
  },
});

export default Devvit;
