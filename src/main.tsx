// main.tsx
import {Devvit} from '@devvit/public-api';
import {PageWelcome} from '@pages/PageWelcome.js';
import {PageTeam} from '@pages/PageTeam.js';
import {PageChallenge} from '@pages/PageChallenge.js';
import {PageVictory} from '@pages/PageVictory.js';
import {questions} from '@utils/questions.js';
import {createInviteForm} from '@utils/inviteForm.js';

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: 'SkillSeeker',
  render: context => {
    const {useState, useForm, reddit, subredditName, postId} = context;
    const safePostId = postId ?? "";
    const [page, setPage] = useState('welcome');

    const specialists = [...new Set(questions.map(q => q.requiredSpecialist))];

    const [teamMembers, setTeamMembers] = useState<Record<string, string>>(
      Object.fromEntries(specialists.map(profession => [profession.toLowerCase(), "Waiting..."]))
    );

    const postLink = `https://www.reddit.com/r/${subredditName}/comments/${postId}`;
    const inviteForm = createInviteForm(useForm, reddit, postLink);

    function handleInvite() {
      console.log("📩 Showing invite form...");
      context.ui.showForm(inviteForm);
    }

    let currentPage;
    switch (page) {
      case 'welcome':
        currentPage = <PageWelcome
                        setPage={setPage}
                        specialists={specialists}
                        onInvite={handleInvite}
                      />;
        break;
      case 'challenge':
        currentPage = <PageChallenge
                        setPage={setPage}
                        teamMembers={teamMembers}
                        reddit={reddit}
                      />;
        break;
      case 'team':
        currentPage = <PageTeam
                        setPage={setPage}
                        onInvite={handleInvite}
                        reddit={reddit}
                        postId={safePostId}
                        teamMembers={teamMembers}
                        setTeamMembers={setTeamMembers}
                      />;
        break;
      case 'victory':
        currentPage = <PageVictory setPage={setPage} />;
        break;
      default:
        currentPage = <PageWelcome 
                        setPage={setPage}
                        specialists={specialists}
                        onInvite={handleInvite}
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