
# 🔮 Skill Seeker

Welcome to **Skill Seeker** — a community multiplayer game that turns your Reddit post into a wild professional quest! Recruit your crew, take on challenges, and climb the leaderboard — all from inside a Reddit thread. This project was built for **[Hack Reddit 2025](https://devpost.com/software/skill-seeker)** to showcase the power of real-time multiplayer experiences using Devvit.

## 🎯 Mission

Become part of a **secret society** of professionals. Each mission requires a team of experts: doctor, astronomer, sysadmin, and more. 🕵️‍♂️💼 Assemble your crew. Answer the right questions. **Win as a team**. 🏆 Get a point as an **individual professional**, and show others your **professionalism** on the leaderboard. 🎯

## 💡 Game Highlights

- ✨ **Assemble a team & face the challenge** — all questions are synced in real-time via Devvit channels.
- 👥 **Comment-based team joining** — just reply with `!join` command.
- 📩 **Invite teammates directly** — use the built-in invite form to bring others into the game.
- ⚡ **Live role validation** — only the right player can answer.
- 🔁 **Restart anytime** — reshuffle your team and try again.
- 📈 **Leaderboard powered by Redis** — top players score big.
- 🎲 **35 total questions and professions** — but only 5 are randomly selected per game.

    No one knows in advance which specialists will be needed — assemble wisely!

    Each team must have exactly **5 players** to begin the challenge.

## 🕹️ How to Play

1. 🔁 Start a new game from the post.
2. 👥 Users join the team via comment: `!join [profession]`
3. 🤝 When all roles are filled, hit **Continue**.
4. 🎓 Answer questions only if it’s your role’s turn.
5. 🏆 Beat the final challenge to score a point on the leaderboard!

## 💬 Example Join

   `!join programmer`

⚡ Will fill the "programmer" slot if it’s available.

## 🧪 Example Flow

1. User A clicks **Go to Team ➡️**
2. Game generates 5 questions and 5 specialists (broadcasted)
3. User B joins with `!join painter`
4. Game shows team status: `PAINTER - userB`
5. Once all filled → start challenge
6. Each user takes their turn answering
7. Victory? Leaderboard +1 point!
Failure? Try again.

## 🧠 Pro Tips

- Only the assigned role can **answer**!
- You can **invite** users via the built-in invite form
- Use **restart** to regenerate roles & questions

## 📋 Requirements

- A Reddit post to host the game
- Devvit app setup and installed on your subreddit
- Users with Reddit accounts (no login required in-game)

## 📦 Tech Stack

- **Devvit API**: realtime sync, UI blocks, Reddit data integration
- **Redis**: persistent leaderboard via `zIncrBy`
- **React-style structure**: modular functional pages with shared props
- **Comment polling**: listens for comments via `getComments()` every 5s

### 🛠 Local Dev Tools

| Tool              | Version           | Notes                      |
|-------------------|-------------------|----------------------------|
| Devvit CLI        | 0.11.7            | Core Devvit CLI            |
| Node.js & npm     | 23.4.0 / 11.1.0   | Includes `npx` utility     |
| TypeScript & Prettier | 5.3.2 / 3.5.3 | For typing and formatting  |
| VS Code           | latest            | Editor of choice           |
| Redis             | latest            | For leaderboard storage    |

## 🧱 Core Components

| Page               | Purpose                                      |
|--------------------|----------------------------------------------|
| `PageWelcome`      | Entry screen with navigation                 |
| `PageTeam`         | Comment-based team assembly                  |
| `PageChallenge`    | Questions by role with validation            |
| `PageVictory`      | Victory screen + point assignment            |
| `PageDefeat`       | Failure screen + restart option              |
| `PageLeaderboard`  | Live leaderboard from Redis                  |

## 🔗 Real-Time Channels

- `question_set` — syncs the exact same questions across all players
- `specialists_sync` — syncs roles for the team
- `page_sync` / `level_sync` — for smooth multi-user transitions
- `reset_team` — resets team slots for a new run

## 🛠 Dev Mode

Built entirely in [`main.tsx`](./main.tsx) using modular page components.
All logic runs inside the Devvit custom post renderer — no backend required beyond Redis for leaderboard scoring.

## 🤝 Built For

Reddit + Devvit + multiplayer fun 🎉
Optimized for community-driven gameplay in subreddit threads.
Perfect for hackathons, online communities, or just showing off what Devvit can really do.

## 📜 License

MIT License — see [`LICENSE`](./LICENSE) for full text.
Built with 💜 by [vero-git-hub](https://github.com/vero-git-hub).
Please keep this credit if you reuse or remix the project.