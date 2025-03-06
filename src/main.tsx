// main.tsx
import { Devvit, useState } from "@devvit/public-api";
import { WelcomePage } from "@pages/WelcomePage.js";
import { QuestionPage } from "@pages/QuestionPage.js";
import { questions } from "@utils/questions.js";

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (_context) => {
    const [screen, setScreen] = useState<"welcome" | "challenge">("challenge");
    const [currentQuestionIndex] = useState(0);
    const [message, setMessage] = useState("");

    function handleAnswer(selectedAnswer: string) {
      if (selectedAnswer === questions[currentQuestionIndex].correct) {
        setMessage("✅ Correct! To proceed, find a physicist.");
      } else {
        setMessage("❌ Wrong answer. Try again!");
      }
    }

    return screen === "welcome" ? (
      <WelcomePage onStartGame={() => setScreen("challenge")} />
    ) : (
      <QuestionPage
        question={questions[currentQuestionIndex].question}
        answers={questions[currentQuestionIndex].answers}
        onAnswer={handleAnswer}
        message={message}
      />
    );
  },
});

export default Devvit;
