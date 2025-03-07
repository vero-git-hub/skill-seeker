// main.tsx
import { Devvit, useState, useChannel } from "@devvit/public-api";
import { WelcomePage } from "@pages/WelcomePage.js";
import { QuestionPage } from "@pages/QuestionPage.js";
import { questions } from "@utils/questions.js";
import { useCommentMonitor } from "@utils/comments.js";

Devvit.configure({
  redditAPI: true,
  realtime: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (context) => {
    const { reddit, postId } = context;
    const [screen, setScreen] = useState<"welcome" | "challenge">("challenge");
    const [message, setMessage] = useState("");
    const [specialists, setSpecialists] = useState<{ [key: string]: string }>({});
    const [monitoring, setMonitoring] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const channel = useChannel({
      name: "join_requests",
      onMessage: (data) => {
        if (!data || typeof data !== "object") return;
        if ("type" in data && data.type === "join" && "user" in data && "profession" in data) {
          const user = String(data.user);
          const profession = String(data.profession);
          console.log(`🛠️ ${user} joined as a ${profession}`);
          setSpecialists((prev) => ({ ...prev, [user]: profession }));
        }
      },
      onSubscribed: () => console.log("✅ Subscribed to join_requests channel"),
    });

    channel.subscribe();

    if (monitoring) {
      useCommentMonitor(postId, reddit, setSpecialists, (data) => channel.send(data), () => setMonitoring(false));
    }

    function handleAnswer(selectedAnswer: string) {
      if (selectedAnswer === questions[currentQuestionIndex].correct) {
        const nextQuestionIndex = currentQuestionIndex + 1;

        if (nextQuestionIndex < questions.length) {
          const requiredSpecialist = questions[nextQuestionIndex]?.requiredSpecialist || "a specialist";
          setMessage(`✅ Correct! To proceed, find ${requiredSpecialist}.`);
          setMonitoring(true);
        } else {
          setMessage("🎉 Congratulations! You've completed the challenge.");
        } 
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
