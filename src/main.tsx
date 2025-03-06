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
    const [screen, setScreen] = useState<"welcome" | "challenge">("welcome");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    function handleAnswer(selectedAnswer: string) {
      if (selectedAnswer === questions[currentQuestionIndex].correct) {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // TODO: Winning the game
        }
      } else {
        // TODO: Incorrect answer (eg show message)
      }
    }

    return screen === "welcome" ? (
      <WelcomePage onStartGame={() => setScreen("challenge")} />
    ) : (
      <QuestionPage
        question={questions[currentQuestionIndex].question}
        answers={questions[currentQuestionIndex].answers}
        onAnswer={handleAnswer}
      />
    );
  },
});

export default Devvit;
