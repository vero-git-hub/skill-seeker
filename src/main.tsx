// main.tsx
import { Devvit, useState, useChannel, useForm } from "@devvit/public-api";
import { WelcomePage } from "@pages/WelcomePage.js";
import { QuestionPage } from "@pages/QuestionPage.js";
import { SpecialistJoinedPage } from "@pages/SpecialistJoinedPage.js";
import { questions } from "@utils/questions.js";
import { useCommentMonitor } from "@utils/comments.js";
import { sendInvitation } from "@utils/sendInvitation.js";

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
      try {
        const [savedState, username] = await Promise.all([
          redis.get("gameState"),
          reddit.getCurrentUsername(),
        ]);

        return {
          screen: "welcome",
          message: "",
          specialists: {},
          monitoring: false,
          currentQuestionIndex: 0,
          joinedSpecialist: null,
          waitingForSpecialist: false,
          players: [],
          ...(savedState ? JSON.parse(savedState) : {}),
          currentUser: username || null,
        };
      } catch (error) {
        console.error("❌ Error fetching game state:", error);
        return {
          screen: "welcome",
          message: "Error loading game state.",
          specialists: {},
          monitoring: false,
          currentQuestionIndex: 0,
          joinedSpecialist: null,
          waitingForSpecialist: false,
          players: [],
          currentUser: null,
        };
      }
    });

    async function updateGameState(newState: any) {
      const updatedState = { ...gameState, ...newState };
      await setGameState(updatedState);
      await redis.set("gameState", JSON.stringify(updatedState));
      await channel.send({ gameState: updatedState });
    }

    const channel = useChannel({
      name: "join_requests",
      onMessage: (data) => {
        if (!data || typeof data !== "object") return;

        if ("gameState" in data) {
          console.log("🔄 Received gameState update:", data.gameState);
          setGameState(data.gameState);
          return;
        }

        if ("type" in data && data.type === "join" && "user" in data && "profession" in data) {
          const user = String(data.user);
          const profession = String(data.profession);
          console.log(`🛠️ ${user} joined as a ${profession}`);
          
          updateGameState({
            specialists: { ...gameState.specialists, [user]: profession },
            players: [...gameState.players, user],
          });
        }
      },
      onSubscribed: () => console.log("✅ Subscribed to join_requests channel"),
    });

    channel.subscribe();

    const requiredSpecialist = questions[gameState.currentQuestionIndex+1]?.requiredSpecialist || "a specialist";

    function handleSpecialistFound(user: string, profession: string) {
      console.log(`✅ Specialist found: ${user} (${profession})`);
    
      const updatedState = {
        ...gameState,
        monitoring: false,
        waitingForSpecialist: false,
        joinedSpecialist: { user, profession },
        screen: "specialist_joined",
      };

      updateGameState(updatedState);
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

    const inviteForm = useForm(
      {
        fields: [
          {
            type: "string",
            name: "inviteUsername",
            label: "Enter Reddit username to invite:",
          },
        ],
      },
      async (values) => {
        const username = values.inviteUsername;
        if (!username) {
          console.error("❌ Please enter a username.");
          return;
        }

        console.log(`📩 Sending invitation to ${username}...`);

        const subredditName = await reddit.getCurrentSubredditName();
        const postLink = `https://www.reddit.com/r/${subredditName}/comments/${context.postId}`;
        await sendInvitation(reddit, username, postLink);
        console.log("✅ Invitation sent!");
      }
    );

    function handleInvite() {
      console.log("📩 Showing invite form...");
      context.ui.showForm(inviteForm);
    }

    function handleAnswer(selectedAnswer: string) {
      if (selectedAnswer === questions[gameState.currentQuestionIndex].correct) {
        const nextQuestionIndex = gameState.currentQuestionIndex + 1;

        if (nextQuestionIndex < questions.length) {
          const nextRequiredSpecialist = questions[nextQuestionIndex]?.requiredSpecialist || "a specialist";

          updateGameState({
            message: `✅ Correct! To proceed, find ${nextRequiredSpecialist}.`,
            monitoring: true,
            waitingForSpecialist: true,
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
      const updatedState = {
        ...gameState,
        screen: "challenge",
        message: "",
        currentQuestionIndex: gameState.currentQuestionIndex + 1,
      };

      console.log("🔄 Sending gameState update from handleContinue:", updatedState);

      updateGameState(updatedState);
    }

    function resetGame() {
      updateGameState({
        screen: "welcome",
        message: "",
        specialists: {},
        monitoring: false,
        currentQuestionIndex: 0,
        joinedSpecialist: null,
        waitingForSpecialist: false,
        players: [],
      });

      channel.send({ type: "stop_monitoring" });
    }
    
    console.log("👤 Current user:", gameState.currentUser);
    console.log("🎮 Players list:", gameState.players);

    return (gameState.screen === "welcome" ? (
          <WelcomePage 
            onStartGame={async () => {
              const currentUser = await reddit.getCurrentUser();
              if (!currentUser) {
                console.error("❌ No current user found!");
                return;
              }
          
              if (!gameState.players.includes(currentUser.username)) { 
                updateGameState({
                  screen: "challenge",
                  players: [...gameState.players, currentUser.username],
                });
              } else {
                console.log("⚠️ Player already in game, not adding again.");
                await updateGameState({ screen: "challenge" });
              }
            }}
          />
        ) : gameState.screen === "specialist_joined" ? (
          <SpecialistJoinedPage 
            gameState={gameState}
            onContinue={handleContinue}
            onRestart={resetGame}
          />
        ) : (
          <QuestionPage
            question={questions[gameState.currentQuestionIndex].question}
            answers={questions[gameState.currentQuestionIndex].answers}
            gameState={gameState}
            onAnswer={handleAnswer}
            onInvite={handleInvite}
            onRestart={resetGame}
          />
        )
    );
  },
});

export default Devvit;
