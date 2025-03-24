// main.tsx
import {Devvit} from '@devvit/public-api';
import {PageWelcome} from '@pages/PageWelcome.js';
import {PageTeam} from '@pages/PageTeam.js';
import {PageChallenge} from '@pages/PageChallenge.js';
import {PageVictory} from '@pages/PageVictory.js';
import {PageDefeat} from '@pages/PageDefeat.js';
import {PageLeaderboard} from '@pages/PageLeaderboard.js';
import {pickRandomQuestions} from '@utils/questions.js';
import {createInviteForm} from '@utils/inviteForm.js';
import {Question} from '@utils/types.js';

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

    const [selectedQuestions, setSelectedQuestions] = useState<Question[] | null>(null);
    const [specialists, setSpecialists] = useState<string[]>([]);
    const [teamMembers, setTeamMembers] = useState<Record<string, string>>({});

    const [currentLevel, setCurrentLevel] = useState(0);

    const validPages = ['welcome', 'team', 'challenge', 'victory', 'defeat', 'leaderboard'];
    const postLink = `https://www.reddit.com/r/${subredditName}/comments/${postId}`;
    const inviteForm = createInviteForm(useForm, reddit, postLink);

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
        if (selectedQuestions && newLevel <= selectedQuestions.length - 1) {
          setCurrentLevel(newLevel);
        }
      }
    });
    levelChannel.subscribe();

    const resetTeamChannel = useChannel({
      name: 'reset_team',
      onMessage: () => {
        setTeamMembers(createEmptyTeam(specialists));
      }
    });
    resetTeamChannel.subscribe();

    const questionChannel = useChannel({
      name: 'question_set',
      onMessage: (newQuestions: Question[]) => {
        setSelectedQuestions(newQuestions);
        const newSpecialists = [...new Set(newQuestions.map((q) => q.requiredSpecialist))];
        setSpecialists(newSpecialists);
        setTeamMembers(createEmptyTeam(newSpecialists));
        setCurrentLevel(0);
      }
    });
    questionChannel.subscribe();

    function handleInvite() {
      console.log("📩 Showing invite form...");
      context.ui.showForm(inviteForm);
    }

    function createEmptyTeam(specList: string[]): Record<string, string> {
      return Object.fromEntries(
        specList.map(profession => [profession.toLowerCase(), "Waiting..."])
      );
    }

    function handleRestart() {
      const newSet = pickRandomQuestions(5);
      const newSpecialists = [...new Set(newSet.map(q => q.requiredSpecialist))];

      context.realtime.send('reset_team', true);
      context.realtime.send('level_sync', 0);
      context.realtime.send('question_set', newSet);
      context.realtime.send('specialists_sync', newSpecialists);

      setTeamMembers(createEmptyTeam(newSpecialists));
      setSelectedQuestions(newSet);
      setSpecialists(newSpecialists);
      setCurrentLevel(0);
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

    async function showLeaderboard() {
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
          questions={selectedQuestions!}
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
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          setSpecialists={setSpecialists}
          context={context}
        />;
        break;
      case 'victory':
        currentPage = <PageVictory
          setPage={updatePage}
          onRestart={handleRestart}
          devvitContext={context}
          teamMembers={teamMembers}
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
          devvitContext={context}
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