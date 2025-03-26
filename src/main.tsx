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
import {GameState} from '@utils/types.js';

Devvit.configure({
  redditAPI: true,
  realtime: true,
});

Devvit.addCustomPostType({
  name: 'SkillSeeker',
  render: context => {
    const {useState, useForm, reddit, subredditName, postId, useChannel} = context;
    const safePostId = postId ?? "";
    
    const [gameState, setGameState] = useState<GameState>({
      page: 'welcome',
      teamMembers: {},
      currentLevel: 0,
      selectedQuestions: null,
      specialists: []
    });
    const {page, teamMembers} = gameState;

    const gameStateChannel = useChannel<GameState>({
      name: 'game_state_sync',
      onMessage: (incomingState: GameState) => {
        setGameState(incomingState);
      }
    });
    gameStateChannel.subscribe();

    const postLink = `https://www.reddit.com/r/${subredditName}/comments/${safePostId}`;
    const inviteForm = createInviteForm(useForm, reddit, postLink);

    function updateGameState(partial: Partial<GameState>) {
      const newState = { ...gameState, ...partial };
      context.realtime.send('game_state_sync', newState);
      setGameState(newState);
    }

    function createEmptyTeam(specialists: string[]): Record<string, string> {
      return Object.fromEntries(
        specialists.map(profession => [profession.toLowerCase(), "Waiting..."])
      );
    }

    function handleRestart() {
      updateGameState({
        page: 'welcome',
        ...createGameSession()
      });
    }

    function createGameSession() {
      const selectedQuestions = pickRandomQuestions(5);
      const specialists = [...new Set(selectedQuestions.map(q => q.requiredSpecialist))];
      const teamMembers = createEmptyTeam(specialists);
    
      return {
        selectedQuestions,
        specialists,
        teamMembers,
        currentLevel: 0
      };
    }

    async function handleInvite() {
      context.ui.showForm(inviteForm);
    }

    async function showLeaderboard() {
      updateGameState({ page: 'leaderboard' });
    }

    if (
      page === 'team' &&
      !gameState.selectedQuestions &&
      Object.keys(gameState.teamMembers).length === 0
    ) {
      updateGameState(createGameSession());
    }

    let currentPage;
    let welcomePage = <PageWelcome 
          gameState={gameState}
          updateGameState={updateGameState}
          onShowLeaderboard={showLeaderboard}
        />;
    switch (page) {
      case 'welcome':
        currentPage = welcomePage;
        break;
      case 'team':
        currentPage = <PageTeam
          gameState={gameState}
          updateGameState={updateGameState}
          reddit={reddit}
          postId={safePostId}
          onInvite={handleInvite}
          onRestart={handleRestart}
        />;
        break;
      case 'challenge':
        currentPage = <PageChallenge
          gameState={gameState}
          updateGameState={updateGameState}
          reddit={reddit}
        />;
        break;
      case 'victory':
        currentPage = <PageVictory
          onRestart={handleRestart}
          devvitContext={context}
          teamMembers={teamMembers}
        />;
        break;
      case 'defeat':
        currentPage = <PageDefeat
          onRestart={handleRestart}
        />;
        break;
      case 'leaderboard':
        currentPage = <PageLeaderboard
          gameState={gameState}
          updateGameState={updateGameState}
          devvitContext={context}
        />;
        break;
      default:
        currentPage = welcomePage;
    }

    return (
      <blocks>
        {currentPage}
      </blocks>
    )
  }
})

export default Devvit;