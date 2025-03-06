// components/ChallengePost.tsx
import { Devvit, useState } from '@devvit/public-api';
import { updatePost } from '@utils/updatePost.js';

interface ChallengePostContext {
  reddit: any;
  post?: any;
}

export function ChallengePost(context: ChallengePostContext) {
  const { reddit, post } = context;
  const [message, setMessage] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [waitingForRole, setWaitingForRole] = useState("engineer");
  const [currentQuestion, setCurrentQuestion] = useState("In what country was Reddit created?");
  const [activePlayer, setActivePlayer] = useState(null);

  async function checkAnswer(selectedAnswer: string) {
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

      <button appearance="primary" onPress={() => checkAnswer("USA")}>
        USA
      </button>
      <button appearance="secondary" onPress={() => checkAnswer("Canada")}>
        Canada
      </button>
      <button appearance="secondary" onPress={() => checkAnswer("UK")}>
        UK
      </button>

      <text size="small">{message}</text>
    </vstack>
  );
}
