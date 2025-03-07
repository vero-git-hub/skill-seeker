// main.tsx
import { Devvit, useState, useChannel, RedditAPIClient } from "@devvit/public-api";
import { WelcomePage } from "@pages/WelcomePage.js";
import { QuestionPage } from "@pages/QuestionPage.js";
import { questions } from "@utils/questions.js";

Devvit.configure({
  redditAPI: true,
  realtime: true,
});

Devvit.addCustomPostType({
  name: "SkillSeeker Experience",
  height: "regular",
  render: (context) => {
    const { reddit, realtime, postId } = context;
    const [screen, setScreen] = useState<"welcome" | "challenge">("challenge");
    const [currentQuestionIndex] = useState(0);
    const [message, setMessage] = useState("");
    const [specialists, setSpecialists] = useState<{ [key: string]: string }>({});

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
      onSubscribed: () => {
        console.log("✅ Subscribed to join_requests channel");
      },
    });

    channel.subscribe();
  
    async function getUserName(reddit: RedditAPIClient, authorId: string): Promise<string> {
      try {
        const user = await reddit.getUserById(authorId);
    
        if (!user) {
          console.warn(`⚠️ User with ID ${authorId} not found.`);
          return "Unknown";
        }
    
        console.log("🔍 Fetched user:", user);
    
        return user.username ?? "Unknown";
      } catch (error) {
        console.error("❌ Error fetching username:", error);
        return "Unknown";
      }
    }    

    async function checkComments(postId: string) {
      try {
        const commentsListing = await reddit.getComments({ postId });

        for await (const comment of commentsListing) {
          if (comment.body.startsWith("!join ")) {
            const profession = comment.body.split("!join ")[1].trim();
            if (profession) {
              const userId = comment.authorId ?? "";
              if (!userId) {
                console.warn("⚠️ Warning: Comment has no valid authorId.");
                continue;
              }

              const userName = await getUserName(reddit, userId);

              console.log(`🛠️ ${userName} joined as a ${profession}`);
              setSpecialists((prev) => ({ ...prev, [userName]: profession }));

              channel.send({
                type: "join",
                user: userName,
                profession: profession,
              });
            }
          }
        }
      } catch (error) {
        console.error("❌ Error while retrieving comments:", error);
      }
    }

    function handleAnswer(selectedAnswer: string) {
      if (selectedAnswer === questions[currentQuestionIndex].correct) {
        setMessage("✅ Correct! To proceed, find a physicist.");

        if (postId) {
          checkComments(postId);
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
