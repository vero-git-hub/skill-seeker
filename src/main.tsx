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
          context.cache(
            async () => {
              const state = await redis.get("gameState");
              return state ? JSON.parse(state) : {};
            },
            { key: `gameState_${safePostId}`, ttl: 30 * 1000 }
          ),
          context.cache(
            async () => {
              const username = await reddit.getCurrentUsername();
              return username || null;
            },
            { key: `user_${context.userId}`, ttl: 5 * 60 * 1000 }
          ),
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
          ...savedState,
          currentUser: username,
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

      if (JSON.stringify(gameState) === JSON.stringify(updatedState)) {
        console.log("No changes in gameState, no update required.");
        return;
      }

      console.log("📢 Updating gameState:", updatedState);

      await setGameState(updatedState);
      await redis.set("gameState", JSON.stringify(updatedState));
      await context.cache(() => updatedState, { key: `gameState_${safePostId}`, ttl: 30 * 1000 });
      
      await context.realtime.send("gameState_updates", updatedState);
    }

    const realtimeChannel = useChannel({
      name: "gameState_updates",
      onMessage: (newGameState) => {
        console.log("🔄 Received gameState update via realtime:", newGameState);
        updateGameState(newGameState);
      },
    });
    realtimeChannel.subscribe();

    const joinRequestsChannel = useChannel({
      name: "join_requests",
      onMessage: (data) => {
        if (!data || typeof data !== "object") return;

        if ("gameState" in data) {
          console.log("🔄 Received gameState update:", data.gameState);
          updateGameState(data.gameState);
          return;
        }

        if ("type" in data && data.type === "join" && "user" in data && "profession" in data) {
          const user = String(data.user);
          const profession = String(data.profession);
          
          if (gameState.players?.includes(user)) {
            console.log(`⚠️ ${user} already in the game, skip the update.`);
            return;
          }

          console.log(`🛠️ ${user} joined as a ${profession}`);
          
          updateGameState({
            specialists: { ...gameState.specialists, [user]: profession },
            players: [...(gameState.players || []), user],
          });
        }
      },
      onSubscribed: () => console.log("✅ Subscribed to join_requests channel"),
    });

    joinRequestsChannel.subscribe();

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
      (data) => joinRequestsChannel.send(data),
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

        const subredditName = await context.cache(
          async () => await reddit.getCurrentSubredditName(),
          { key: `subreddit_${context.postId}`, ttl: 5 * 60 * 1000 }
        );

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

    async function resetGame() {
      const initialState = {
        screen: "welcome",
        message: "",
        specialists: {},
        monitoring: false,
        currentQuestionIndex: 0,
        joinedSpecialist: null,
        waitingForSpecialist: false,
        players: [],
      };

      updateGameState(initialState);

      joinRequestsChannel.send({ type: "stop_monitoring" });

      await context.realtime.send("gameState_updates", initialState);
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
