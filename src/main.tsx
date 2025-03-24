// main.tsx
import {Devvit} from '@devvit/public-api';
import {PageWelcome} from '@pages/PageWelcome.js';
import {PageTeam} from '@pages/PageTeam.js';
import {PageChallenge} from '@pages/PageChallenge.js';
import {PageVictory} from '@pages/PageVictory.js';
import {PageDefeat} from '@pages/PageDefeat.js';
import {questions} from '@utils/questions.js';
import {createInviteForm} from '@utils/inviteForm.js';
import {PageLeaderboard} from '@pages/PageLeaderboard.js';

Devvit.configure({
  redditAPI: true,
  realtime: true,
});

Devvit.addCustomPostType({
  name: 'SkillSeeker',
  render: context => {
    const {useState, useForm, reddit, subredditName, postId, useChannel} = context;
    const safePostId = postId ?? "";
    const [page, setPage] = useState('welcome');
    
    const specialists = [...new Set(questions.map(q => q.requiredSpecialist))];
    const [teamMembers, setTeamMembers] = useState<Record<string, string>>(
      Object.fromEntries(specialists.map(profession => [profession.toLowerCase(), "Waiting..."]))
    );

    const validPages = ['welcome', 'team', 'challenge', 'victory', 'defeat', 'leaderboard'];

    const postLink = `https://www.reddit.com/r/${subredditName}/comments/${postId}`;
    const inviteForm = createInviteForm(useForm, reddit, postLink);

    const [currentLevel, setCurrentLevel] = useState(0);

    const [leaderboard, setLeaderboard] = useState<{ member: string, score: number }[]>([]);

    const pageChannel = useChannel({
      name: 'page_sync',
      onMessage: (newPage: string) => {
        if (validPages.includes(newPage)) {
          setPage(newPage);
        } else {
          console.warn("❗ Invalid page received via realtime:", newPage);
        }
      }
    });
    pageChannel.subscribe();

    const levelChannel = useChannel({
      name: 'level_sync',
      onMessage: (newLevel: number) => {
        if (newLevel <= questions.length - 1) {
          setCurrentLevel(newLevel);
        }
      }
    });
    levelChannel.subscribe();

    const resetTeamChannel = useChannel({
      name: 'reset_team',
      onMessage: () => {
        setTeamMembers(resetTeamMembers());
      }
    });
    resetTeamChannel.subscribe();

    function handleInvite() {
      console.log("📩 Showing invite form...");
      context.ui.showForm(inviteForm);
    }

    function resetTeamMembers(): Record<string, string> {
      return Object.fromEntries(
        specialists.map((profession) => [profession.toLowerCase(), "Waiting..."])
      );
    }

    function handleRestart() {
      context.realtime.send('reset_team', true);
      setTeamMembers(resetTeamMembers());
      updatePage('welcome');
    }

    function updatePage(newPage: string) {
      if (newPage !== page) {
        context.realtime.send('page_sync', newPage);
        setPage(newPage);
      }
    }

    function updateLevel(newLevel: number) {
      context.realtime.send('level_sync', newLevel);
      setCurrentLevel(newLevel);
    }

    async function updateLeaderboard() {
      for (const player of Object.values(teamMembers)) {
        if (player !== "Waiting...") {
          await context.redis.zIncrBy('leaderboard', player, 1);
        }
      }
    }

    async function getLeaderboard(context: Devvit.Context): Promise<{ member: string, score: number }[]> {
      const top = await context.redis.zRange('leaderboard', 0, 9, {
        reverse: true,
        by: 'rank',
      });
    
      return top;
    }

    async function showLeaderboard() {
      const top = await getLeaderboard(context);
      setLeaderboard(top);
      updatePage('leaderboard');
    }

    let currentPage;
    switch (page) {
      case 'welcome':
        currentPage = <PageWelcome
          setPage={updatePage}
          onShowLeaderboard={showLeaderboard}
        />;
        break;
      case 'challenge':
        currentPage = <PageChallenge
          setPage={updatePage}
          reddit={reddit}
          teamMembers={teamMembers}
          currentLevel={currentLevel}
          setCurrentLevel={updateLevel}
        />;
        break;
      case 'team':
        currentPage = <PageTeam
          setPage={updatePage}
          onInvite={handleInvite}
          reddit={reddit}
          postId={safePostId}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          onRestart={handleRestart}
        />;
        break;
      case 'victory':
        currentPage = <PageVictory
          setPage={updatePage}
          onRestart={handleRestart}
          onVictory={updateLeaderboard}
        />;
        break;
      case 'defeat':
        currentPage = <PageDefeat
          setPage={updatePage}
          onRestart={handleRestart}
        />;
        break;
      case 'leaderboard':
        currentPage = <PageLeaderboard
          setPage={updatePage}
          leaderboard={leaderboard}
        />;
        break;
      default:
        currentPage = <PageWelcome 
          setPage={updatePage}
          onShowLeaderboard={showLeaderboard}
        />;
    }

    return (
      <blocks>
        {currentPage}
      </blocks>
    )
  }
})

export default Devvit;