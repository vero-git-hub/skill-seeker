// main.tsx
import { Devvit, useState, useChannel } from "@devvit/public-api";
import { WelcomePage } from "@pages/WelcomePage.js";
import { QuestionPage } from "@pages/QuestionPage.js";
import { SpecialistJoinedPage } from "@pages/SpecialistJoinedPage.js";
import { questions } from "@utils/questions.js";
import { useCommentMonitor } from "@utils/comments.js";

Devvit.configure({
  redditAPI: true,
  realtime: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (context) => {
    const { reddit, redis, postId } = context;
    const safePostId = postId ?? "";

    const [gameState, setGameState] = useState(async () => {
      const savedState = await redis.get("gameState");
      return savedState
        ? JSON.parse(savedState)
        : {
            screen: "welcome",
            message: "",
            specialists: {},
            monitoring: false,
            currentQuestionIndex: 0,
            joinedSpecialist: null,
            waitingForSpecialist: false,
          };
    });

    async function updateGameState(newState) {
      const updatedState = { ...gameState, ...newState };
      setGameState(updatedState);
      await redis.set("gameState", JSON.stringify(updatedState));
      await channel.send({ gameState: updatedState });
    }

    const channel = useChannel({
      name: "join_requests",
      onMessage: (data) => {
        if (!data || typeof data !== "object") return;
        if ("type" in data && data.type === "join" && "user" in data && "profession" in data) {
          const user = String(data.user);
          const profession = String(data.profession);
          console.log(`🛠️ ${user} joined as a ${profession}`);
          
          updateGameState({
            specialists: { ...gameState.specialists, [user]: profession },
          });
        }
      },
      onSubscribed: () => console.log("✅ Subscribed to join_requests channel"),
    });

    channel.subscribe();

    const requiredSpecialist = questions[gameState.currentQuestionIndex + 1]?.requiredSpecialist || "a specialist";

    function handleSpecialistFound(user: string, profession: string) {
      updateGameState({
        monitoring: false,
        waitingForSpecialist: false,
        joinedSpecialist: { user, profession },
        screen: "specialist_joined",
      });
    }

    useCommentMonitor(
      gameState.monitoring,
      safePostId,
      reddit,
      gameState.specialists,
      updateGameState,
      (data) => channel.send(data),
      handleSpecialistFound,
      requiredSpecialist
    );

    function handleAnswer(selectedAnswer: string) {
      if (selectedAnswer === questions[gameState.currentQuestionIndex].correct) {
        const nextQuestionIndex = gameState.currentQuestionIndex + 1;

        if (nextQuestionIndex < questions.length) {
          const nextRequiredSpecialist = questions[nextQuestionIndex]?.requiredSpecialist || "a specialist";

          updateGameState({
            message: `✅ Correct! To proceed, find ${nextRequiredSpecialist}.`,
            monitoring: true,
            waitingForSpecialist: true,
            currentQuestionIndex: nextQuestionIndex,
          });
        } else {
          updateGameState({
            message: "🎉 Congratulations! You've completed the challenge.",
            screen: "finished",
            waitingForSpecialist: false,
          });
        } 
      } else {
        updateGameState({ message: "❌ Wrong answer. Try again!" });
      }
    }

    function handleContinue() {
      updateGameState({
        screen: "challenge",
        message: "",
        currentQuestionIndex: gameState.currentQuestionIndex + 1,
      });
    }

    return gameState.screen === "welcome" ? (
      <WelcomePage onStartGame={() => updateGameState({ screen: "challenge" })} />
    ) : gameState.screen === "specialist_joined" ? (
      <SpecialistJoinedPage 
        joinedSpecialist={gameState.joinedSpecialist} 
        specialists={gameState.specialists} 
        onContinue={handleContinue}
      />
    ) : (
      <QuestionPage
        question={questions[gameState.currentQuestionIndex].question}
        answers={questions[gameState.currentQuestionIndex].answers}
        onAnswer={handleAnswer}
        message={gameState.message}
      />
    );
  },
});

export default Devvit;
