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
      useCommentMonitor(postId, reddit, setSpecialists, (data) => channel.send(data));
    }

    function handleAnswer(selectedAnswer: string) {
      if (selectedAnswer === questions[0].correct) {
        setMessage("✅ Correct! To proceed, find a physicist.");
        setMonitoring(true);
      } else {
        setMessage("❌ Wrong answer. Try again!");
      }
    }

    return screen === "welcome" ? (
      <WelcomePage onStartGame={() => setScreen("challenge")} />
    ) : (
      <QuestionPage
        question={questions[0].question}
        answers={questions[0].answers}
        onAnswer={handleAnswer}
        message={message}
      />
    );
  },
});

export default Devvit;
